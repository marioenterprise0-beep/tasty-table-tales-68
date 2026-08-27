import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

const STOP_WORDS = ["stop", "stopall", "unsubscribe", "cancel", "end", "quit", "revoke", "optout", "opt-out"];
const START_WORDS = ["start", "unstop", "yes"];

/**
 * Verifies Twilio's X-Twilio-Signature: HMAC-SHA1 of the full request URL with
 * every POST parameter appended in sorted key order, keyed by the account auth
 * token, base64 encoded. Compared in constant time.
 */
function isValidTwilioSignature(params: {
  authToken: string;
  signature: string;
  url: string;
  fields: Record<string, string>;
}) {
  const payload =
    params.url +
    Object.keys(params.fields)
      .sort()
      .map((key) => key + params.fields[key])
      .join("");
  const expected = createHmac("sha1", params.authToken).update(Buffer.from(payload, "utf-8")).digest("base64");
  const a = Buffer.from(params.signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Inbound SMS webhook. The signature is validated before the payload is read
 * for meaning — an unsigned or badly signed call never reaches the database.
 * STOP always wins: the number is suppressed even when no account exists.
 */
export const Route = createFileRoute("/api/public/sms-inbound")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authToken = process.env["TWILIO_AUTH_TOKEN"];
        const signature = request.headers.get("x-twilio-signature");

        // Fail closed. No token configured means we cannot authenticate anyone.
        if (!authToken) {
          console.error("sms-inbound rejected: TWILIO_AUTH_TOKEN is not configured");
          return new Response("Webhook not configured", { status: 503 });
        }
        if (!signature) return new Response("Missing signature", { status: 401 });

        const contentType = request.headers.get("content-type") ?? "";
        const raw = await request.text();

        // Parse to fields only to recompute the signature — no side effects yet.
        const fields: Record<string, string> = {};
        if (contentType.includes("application/json")) {
          try {
            const json = JSON.parse(raw) as Record<string, unknown>;
            for (const [k, v] of Object.entries(json)) fields[k] = String(v);
          } catch {
            return new Response("Bad request", { status: 400 });
          }
        } else {
          for (const [k, v] of new URLSearchParams(raw)) fields[k] = v;
        }

        // Twilio signs the public URL it was configured with. Honour a proxy
        // override so the signature still matches behind Lovable's edge.
        const configuredUrl = process.env["TWILIO_WEBHOOK_URL"];
        const forwardedProto = request.headers.get("x-forwarded-proto");
        const requestUrl = new URL(request.url);
        if (forwardedProto) requestUrl.protocol = `${forwardedProto}:`;
        const candidates = [configuredUrl, requestUrl.toString()].filter(Boolean) as string[];

        const verified = candidates.some((url) =>
          isValidTwilioSignature({ authToken, signature, url, fields }),
        );
        if (!verified) {
          console.warn("sms-inbound rejected: invalid signature");
          return new Response("Invalid signature", { status: 403 });
        }

        // ---- verified past this point ----
        const from = fields["From"] ?? fields["from"] ?? "";
        const body = fields["Body"] ?? fields["body"] ?? "";

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
