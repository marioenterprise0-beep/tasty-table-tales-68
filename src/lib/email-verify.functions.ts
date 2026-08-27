/**
 * Email address verification.
 *
 * An email on a customer record is untrusted until the owner clicks the link
 * we send to it. Only a verified email may ever be used as a sign-in fallback,
 * and changing the email resets that trust.
 */
import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().trim().uuid() });
const sendSchema = z.object({ origin: z.string().trim().url().max(300) });

export const sendMyEmailVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => sendSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendCustomerEmail } = await import("./notify.server");

    const { data: current } = await supabaseAdmin
      .from("customers")
      .select("id, email, email_verified")
      .eq("user_id", context.userId)
      .maybeSingle();

    if (!current?.email) return { ok: false as const, message: "Add an email address first." };
    if (current.email_verified) return { ok: false as const, message: "That email is already verified." };

    const token = crypto.randomUUID();
    const { error } = await supabaseAdmin
      .from("customers")
      .update({
        email_verify_token: token,
        email_verify_sent_at: new Date().toISOString(),
        email_verify_target: current.email.toLowerCase(),
      })
      .eq("id", current.id);
    if (error) throw new Error("We couldn't start verification. Please try again.");

    const link = `${data.origin.replace(/\/$/, "")}/verify-email?token=${token}`;
    await sendCustomerEmail(current.email, "Confirm your email — Gotham Halal", [
      "Confirm this address so you can use it to sign in and get Gotham Halal email updates.",
      "",
      link,
      "",
      "If you didn't request this, ignore this email — nothing changes.",
    ]);

    return { ok: true as const, message: `Verification link sent to ${current.email}.` };
  });

export const confirmEmailVerification = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: match } = await supabaseAdmin
      .from("customers")
      .select("id, email, email_verify_target, email_verify_sent_at")
      .eq("email_verify_token", data.token)
      .maybeSingle();

    if (!match) return { ok: false as const, message: "That link is no longer valid." };

    const sentAt = match.email_verify_sent_at ? new Date(match.email_verify_sent_at).getTime() : 0;
    if (!sentAt || Date.now() - sentAt > 24 * 60 * 60 * 1000) {
      return { ok: false as const, message: "That link has expired. Request a new one from your account page." };
    }
    // The address must still be the one the link was issued for.
    if ((match.email ?? "").toLowerCase() !== (match.email_verify_target ?? "").toLowerCase()) {
      return { ok: false as const, message: "That link no longer matches the email on the account." };
    }

    const { error } = await supabaseAdmin
      .from("customers")
      .update({
        email_verified: true,
        email_verify_token: null,
        email_verify_target: null,
      })
      .eq("id", match.id);
    if (error) throw new Error("We couldn't confirm that address. Please try again.");

    return { ok: true as const, message: "Email confirmed. You can now use it to sign in." };
  });
