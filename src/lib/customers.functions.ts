import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { profileSchema, preferencesSchema } from "./customers.schemas";

async function requestMeta() {
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  const forwarded = getRequestHeader("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || getRequestHeader("cf-connecting-ip") || null;
  return { ip, userAgent: getRequestHeader("user-agent") ?? null };
}

async function syncToGhl(input: {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  source: string;
  tags?: string[];
}) {
  try {
    const { upsertGhlContact } = await import("./ghl.server");
    await upsertGhlContact({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      source: input.source,
      tags: ["Customer Account", ...(input.tags ?? [])],
    });
  } catch (error) {
    console.error("[ghl] account sync failed", error);
  }
}

export const getMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { linkAuthenticatedCustomer } = await import("./customers.server");
    const claims = context.claims as { phone?: string; email?: string };
    const record = await linkAuthenticatedCustomer({
      userId: context.userId,
      phone: claims.phone ?? null,
      email: claims.email ?? null,
    });

    if (record) {
      void syncToGhl({
        firstName: record.first_name,
        lastName: record.last_name,
        email: record.email,
        phone: record.phone,
        source: "account",
      });
    }

    return record;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => profileSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: current } = await supabaseAdmin
      .from("customers")
      .select("id, email, email_verified")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!current) throw new Error("We couldn't find your account.");

    const nextEmail = data.email ? data.email.trim().toLowerCase() : null;
    const emailChanged = (current.email ?? "").toLowerCase() !== (nextEmail ?? "");

    const patch: {
      first_name: string;
      last_name: string | null;
      email: string | null;
      birthday_month: number | null;
      birthday_day: number | null;
      email_verified?: boolean;
      email_verify_token?: string | null;
      email_verify_target?: string | null;
      email_opt_in?: boolean;
    } = {
      first_name: data.firstName,
      last_name: data.lastName || null,
      email: nextEmail,
      birthday_month: data.birthdayMonth ?? null,
      birthday_day: data.birthdayDay ?? null,
    };

    // A new address is untrusted until re-verified: it cannot be used to sign
    // in, and we stop emailing it until the owner confirms it.
    if (emailChanged) {
      patch.email_verified = false;
      patch.email_verify_token = null;
      patch.email_verify_target = null;
      patch.email_opt_in = false;
    }

    const { error } = await supabaseAdmin.from("customers").update(patch).eq("id", current.id);
    if (error) {
      console.error("profile update failed", error.message);
      throw new Error("We couldn't save your details. Please try again.");
    }
    return { ok: true as const, emailNeedsVerification: emailChanged && Boolean(nextEmail) };
  });

export const updateMyPreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => preferencesSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { recordConsent, suppress, unsuppress } = await import("./customers.server");
    const { ip, userAgent } = await requestMeta();
    const now = new Date().toISOString();

    const { data: current, error: readError } = await supabaseAdmin
      .from("customers")
      .select("id, phone, email, sms_opt_in, email_opt_in")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (readError || !current) throw new Error("We couldn't find your account.");

    const patch: {
      sms_opt_in: boolean;
      email_opt_in: boolean;
      sms_consent_timestamp?: string;
      sms_consent_ip?: string | null;
      email_consent_timestamp?: string;
      email_consent_ip?: string | null;
    } = { sms_opt_in: data.smsOptIn, email_opt_in: data.emailOptIn };

    if (data.smsOptIn && !current.sms_opt_in) {
      patch.sms_consent_timestamp = now;
      patch.sms_consent_ip = ip;
    }
    if (data.emailOptIn && !current.email_opt_in) {
      patch.email_consent_timestamp = now;
      patch.email_consent_ip = ip;
    }

    const { error } = await supabaseAdmin.from("customers").update(patch).eq("id", current.id);
    if (error) {
      console.error("preferences update failed", error.message);
      throw new Error("We couldn't save your preferences. Please try again.");
    }

    if (data.smsOptIn !== current.sms_opt_in) {
      await recordConsent({
        customerId: current.id,
        phone: current.phone,
        channel: "sms",
        action: data.smsOptIn ? "grant" : "revoke",
        source: "account_page",
        ip,
        userAgent,
      });
      if (data.smsOptIn) await unsuppress("sms", current.phone);
      else await suppress("sms", current.phone, "account_page");
    }

    if (data.emailOptIn !== current.email_opt_in && current.email) {
      await recordConsent({
        customerId: current.id,
        email: current.email,
        channel: "email",
        action: data.emailOptIn ? "grant" : "revoke",
        source: "account_page",
        ip,
        userAgent,
      });
      if (data.emailOptIn) await unsuppress("email", current.email.toLowerCase());
      else await suppress("email", current.email.toLowerCase(), "account_page");
    }

    return { ok: true as const };
  });

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { suppress } = await import("./customers.server");

    const { data: current } = await supabaseAdmin
      .from("customers")
      .select("id, phone, email, sms_opt_in, email_opt_in")
      .eq("user_id", context.userId)
      .maybeSingle();

    if (current) {
      // Deleting the account must not resurrect marketing consent later.
      if (current.sms_opt_in) await suppress("sms", current.phone, "account_deleted");
      if (current.email_opt_in && current.email)
        await suppress("email", current.email.toLowerCase(), "account_deleted");
      await supabaseAdmin.from("customers").delete().eq("id", current.id);
    }

    const { error } = await supabaseAdmin.auth.admin.deleteUser(context.userId);
    if (error) console.error("auth user delete failed", error.message);

    return { ok: true as const };
  });
