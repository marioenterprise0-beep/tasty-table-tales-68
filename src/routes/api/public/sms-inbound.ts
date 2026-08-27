import { createFileRoute } from "@tanstack/react-router";

const STOP_WORDS = ["stop", "stopall", "unsubscribe", "cancel", "end", "quit", "revoke", "optout", "opt-out"];
const START_WORDS = ["start", "unstop", "yes"];

/**
 * Inbound SMS webhook (Twilio-compatible form post).
 * STOP always wins: the number is suppressed even when no account exists.
 */
export const Route = createFileRoute("/api/public/sms-inbound")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["SMS_WEBHOOK_SECRET"];
        if (secret) {
          const url = new URL(request.url);
          if (url.searchParams.get("key") !== secret) {
            return new Response("Unauthorized", { status: 401 });
          }
        }

        const contentType = request.headers.get("content-type") ?? "";
        let from = "";
        let body = "";
        if (contentType.includes("application/json")) {
          const json = (await request.json()) as Record<string, unknown>;
          from = String(json["From"] ?? json["from"] ?? "");
          body = String(json["Body"] ?? json["body"] ?? "");
        } else {
          const form = await request.formData();
          from = String(form.get("From") ?? form.get("from") ?? "");
          body = String(form.get("Body") ?? form.get("body") ?? "");
        }

        const { normalizePhone } = await import("@/lib/phone");
        const phone = normalizePhone(from);
        const keyword = body.trim().toLowerCase().replace(/[^a-z-]/g, "");
        if (!phone || (!STOP_WORDS.includes(keyword) && !START_WORDS.includes(keyword))) {
          return new Response("<Response></Response>", {
            headers: { "content-type": "text/xml" },
          });
        }

        const isStop = STOP_WORDS.includes(keyword);
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { recordConsent, suppress, unsuppress } = await import("@/lib/customers.server");

        const { data: customer } = await supabaseAdmin
          .from("customers")
          .select("id")
          .eq("phone", phone)
          .maybeSingle();

        if (isStop) {
          await suppress("sms", phone, "sms_stop_keyword");
          if (customer) {
            await supabaseAdmin.from("customers").update({ sms_opt_in: false }).eq("id", customer.id);
          }
        } else {
          await unsuppress("sms", phone);
        }

        await recordConsent({
          customerId: customer?.id ?? null,
          phone,
          channel: "sms",
          action: isStop ? "revoke" : "grant",
          source: `sms_keyword_${keyword}`,
        });

        return new Response("<Response></Response>", { headers: { "content-type": "text/xml" } });
      },
    },
  },
});
