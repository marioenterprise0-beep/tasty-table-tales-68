import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { profileSchema, preferencesSchema } from "./customers.schemas";

function requestMeta() {
  const forwarded = getRequestHeader("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || getRequestHeader("cf-connecting-ip") || null;
  return { ip, userAgent: getRequestHeader("user-agent") ?? null };
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
    return record;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => profileSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("customers")
      .update({
        first_name: data.firstName,
        last_name: data.lastName || null,
        email: data.email || null,
        birthday_month: data.birthdayMonth ?? null,
        birthday_day: data.birthdayDay ?? null,
      })
      .eq("user_id", context.userId);
    if (error) {
      console.error("profile update failed", error.message);
      throw new Error("We couldn't save your details. Please try again.");
    }
    return { ok: true as const };
  });

export const updateMyPreferences = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => preferencesSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { recordConsent, suppress, unsuppress } = await import("./customers.server");
    const { ip, userAgent } = requestMeta();
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
