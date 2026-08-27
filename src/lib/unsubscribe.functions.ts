import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const tokenSchema = z.object({ token: z.string().trim().uuid("This unsubscribe link is invalid.") });

function maskEmail(email: string | null) {
  if (!email) return null;
  const [name, domain] = email.split("@");
  if (!name || !domain) return null;
  return `${name.slice(0, 2)}${"*".repeat(Math.max(name.length - 2, 1))}@${domain}`;
}

/** Public: looks up who a token belongs to, without exposing the full address. */
export const lookupUnsubscribe = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("customers")
      .select("email, email_opt_in")
      .eq("unsubscribe_token", data.token)
      .maybeSingle();
    if (!row) return { found: false as const };
    return { found: true as const, email: maskEmail(row.email), optedIn: row.email_opt_in };
  });

/** Public: one-click email opt-out. No sign-in required (CAN-SPAM). */
export const confirmUnsubscribe = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => tokenSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { recordConsent, suppress } = await import("./customers.server");
    const forwarded = getRequestHeader("x-forwarded-for") ?? "";
    const ip = forwarded.split(",")[0]?.trim() || null;

    const { data: row } = await supabaseAdmin
      .from("customers")
      .select("id, email")
      .eq("unsubscribe_token", data.token)
      .maybeSingle();
    if (!row) throw new Error("This unsubscribe link is no longer valid.");

    await supabaseAdmin.from("customers").update({ email_opt_in: false }).eq("id", row.id);
    if (row.email) await suppress("email", row.email.toLowerCase(), "unsubscribe_link");
    await recordConsent({
      customerId: row.id,
      email: row.email,
      channel: "email",
      action: "revoke",
      source: "unsubscribe_link",
      ip,
      userAgent: getRequestHeader("user-agent") ?? null,
    });

    return { ok: true as const };
  });
