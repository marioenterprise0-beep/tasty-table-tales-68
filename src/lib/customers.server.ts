/**
 * Server-only customer + consent helpers.
 *
 * Consent rules encoded here are legal requirements (TCPA / CAN-SPAM):
 * - opt-ins are never implied; every grant stores a timestamp and IP
 * - revoking clears the flag but the historical consent_events row is kept
 * - anything on the suppression list is never messaged again
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { normalizePhone } from "./phone";

export type Channel = "sms" | "email";

export async function recordConsent(params: {
  customerId?: string | null;
  phone?: string | null;
  email?: string | null;
  channel: Channel;
  action: "grant" | "revoke";
  source: string;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const { error } = await supabaseAdmin.from("consent_events").insert({
    customer_id: params.customerId ?? null,
    phone: params.phone ?? null,
    email: params.email ?? null,
    channel: params.channel,
    action: params.action,
    source: params.source,
    ip_address: params.ip ?? null,
    user_agent: params.userAgent ?? null,
  });
  if (error) console.error("consent event insert failed", error.message);
}

export async function suppress(channel: Channel, value: string, reason: string) {
  const { error } = await supabaseAdmin
    .from("suppression_list")
    .upsert({ channel, value, reason }, { onConflict: "channel,value" });
  if (error) console.error("suppression insert failed", error.message);
}

export async function unsuppress(channel: Channel, value: string) {
  const { error } = await supabaseAdmin
    .from("suppression_list")
    .delete()
    .eq("channel", channel)
    .eq("value", value);
  if (error) console.error("suppression delete failed", error.message);
}

export async function isSuppressed(channel: Channel, value: string) {
  const { data } = await supabaseAdmin
    .from("suppression_list")
    .select("id")
    .eq("channel", channel)
    .eq("value", value)
    .maybeSingle();
  return Boolean(data);
}

/**
 * Creates or updates the customer record behind a marketing signup form.
 * Existing forms keep their behaviour; this is the single source of truth now.
 */
export async function upsertCustomerFromSignup(params: {
  phone: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  smsOptIn: boolean;
  emailOptIn?: boolean;
  source: string;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const phone = normalizePhone(params.phone);
  if (!phone) return null;

  const suppressed = await isSuppressed("sms", phone);
  const smsOptIn = params.smsOptIn && !suppressed;
  const now = new Date().toISOString();

  const { data: existing } = await supabaseAdmin
    .from("customers")
    .select("id, sms_opt_in, first_name, email, sms_consent_timestamp")
    .eq("phone", phone)
    .maybeSingle();

  if (!existing) {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .insert({
        phone,
        first_name: params.firstName || null,
        last_name: params.lastName || null,
        email: params.email || null,
        sms_opt_in: smsOptIn,
        sms_consent_timestamp: smsOptIn ? now : null,
        sms_consent_ip: smsOptIn ? params.ip ?? null : null,
        signup_source: params.source,
      })
      .select("id")
      .single();
    if (error) {
      console.error("customer insert failed", error.message);
      return null;
    }
    if (smsOptIn) {
      await recordConsent({
        customerId: data.id,
        phone,
        channel: "sms",
        action: "grant",
        source: params.source,
        ip: params.ip ?? null,
        userAgent: params.userAgent ?? null,
      });
    }
    return data.id;
  }

  const patch: {
    first_name?: string;
    email?: string;
    sms_opt_in?: boolean;
    sms_consent_timestamp?: string;
    sms_consent_ip?: string | null;
  } = {};
  if (!existing.first_name && params.firstName) patch["first_name"] = params.firstName;
  if (!existing.email && params.email) patch["email"] = params.email;
  if (smsOptIn && !existing.sms_opt_in) {
    patch["sms_opt_in"] = true;
    patch["sms_consent_timestamp"] = now;
    patch["sms_consent_ip"] = params.ip ?? null;
  }
  if (Object.keys(patch).length > 0) {
    const { error } = await supabaseAdmin.from("customers").update(patch).eq("id", existing.id);
    if (error) console.error("customer update failed", error.message);
  }
  if (smsOptIn && !existing.sms_opt_in) {
    await recordConsent({
      customerId: existing.id,
      phone,
      channel: "sms",
      action: "grant",
      source: params.source,
      ip: params.ip ?? null,
      userAgent: params.userAgent ?? null,
    });
  }
  return existing.id;
}

/** Finds (or creates) the customer row for a freshly authenticated user. */
export async function linkAuthenticatedCustomer(params: {
  userId: string;
  phone?: string | null;
  email?: string | null;
}) {
  const now = new Date().toISOString();
  const phone = normalizePhone(params.phone);

  const { data: byUser } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("user_id", params.userId)
    .maybeSingle();
  if (byUser) {
    await supabaseAdmin
      .from("customers")
      .update({ last_sign_in_at: now, phone_verified: phone ? true : byUser.phone_verified })
      .eq("id", byUser.id);
    return { ...byUser, last_sign_in_at: now };
  }

  if (phone) {
    const { data: byPhone } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();
    if (byPhone) {
      const { data } = await supabaseAdmin
        .from("customers")
        .update({
          user_id: params.userId,
          phone_verified: true,
          last_sign_in_at: now,
          email: byPhone.email || params.email || null,
        })
        .eq("id", byPhone.id)
        .select("*")
        .single();
      return data;
    }
  }

  if (params.email) {
    const { data: byEmail } = await supabaseAdmin
      .from("customers")
      .select("*")
      .is("user_id", null)
      .ilike("email", params.email)
      .maybeSingle();
    if (byEmail) {
      const { data } = await supabaseAdmin
        .from("customers")
        .update({ user_id: params.userId, last_sign_in_at: now })
        .eq("id", byEmail.id)
        .select("*")
        .single();
      return data;
    }
  }

  const { data, error } = await supabaseAdmin
    .from("customers")
    .insert({
      user_id: params.userId,
      phone: phone ?? `pending:${params.userId}`,
      email: params.email || null,
      phone_verified: Boolean(phone),
      last_sign_in_at: now,
      signup_source: "account",
    })
    .select("*")
    .single();
  if (error) {
    console.error("customer create on sign-in failed", error.message);
    throw new Error("We couldn't load your account. Please try again.");
  }
  return data;
}
