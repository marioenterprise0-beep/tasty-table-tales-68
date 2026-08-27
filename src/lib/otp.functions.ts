/**
 * Phone one-time-code sign-in, routed through the server so every request is
 * rate limited, country-restricted and logged BEFORE any SMS can be sent.
 * The browser never calls supabase.auth.signInWithOtp directly.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const requestSchema = z.object({
  phone: z.string().trim().min(7).max(30),
  /** Honeypot: real people never fill this, bots fill every field they find. */
  company: z.string().max(200).optional().or(z.literal("")),
  /** Milliseconds the form was on screen before submit; bots submit instantly. */
  elapsedMs: z.coerce.number().int().min(0).max(1000 * 60 * 60).optional(),
});

const verifySchema = z.object({
  phone: z.string().trim().min(7).max(30),
  code: z.string().trim().min(4).max(10),
});

function requestMeta() {
  const forwarded = getRequestHeader("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || getRequestHeader("cf-connecting-ip") || null;
  return { ip, userAgent: getRequestHeader("user-agent") ?? null };
}

export const requestPhoneCode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => requestSchema.parse(data))
  .handler(async ({ data }) => {
    const { ip, userAgent } = requestMeta();
    const { toUsCanadaE164 } = await import("./phone");
    const { checkOtpAllowed, logRateLimitEvent } = await import("./rate-limit.server");

    // 1. Bot check first — never spend a rate-limit slot or an SMS on a bot.
    if ((data.company ?? "") !== "" || (data.elapsedMs !== undefined && data.elapsedMs < 1200)) {
      await logRateLimitEvent({
        kind: "otp_request",
        ip,
        userAgent,
        outcome: "blocked",
        detail: "bot_check",
      });
      // Deliberately vague and "successful looking" so scripts learn nothing.
      return { ok: false as const, message: "We couldn't send a code to that number." };
    }

    // 2. US / Canada only. Everything else is rejected before the provider is touched.
    const phone = toUsCanadaE164(data.phone);
    if (!phone) {
      await logRateLimitEvent({
        kind: "otp_request",
        ip,
        userAgent,
        outcome: "blocked",
        detail: "non_us_ca_number",
      });
      return {
        ok: false as const,
        message: "We can only text US and Canada numbers. Enter a 10-digit number or sign in by email.",
      };
    }

    // 3. Rate limits + lockout.
    const gate = await checkOtpAllowed(phone, ip);
    if (!gate.ok) {
      await logRateLimitEvent({
        kind: "otp_request",
        phone,
        ip,
        userAgent,
        outcome: "blocked",
        detail: gate.reason,
      });
      return { ok: false as const, message: gate.reason };
    }

    // 4. Only now may a message be sent.
    const { getServerAuthClient } = await import("./supabase-auth.server");
    const client = getServerAuthClient();
    const { error } = await client.auth.signInWithOtp({ phone, options: { channel: "sms" } });

    await logRateLimitEvent({
      kind: "otp_request",
      phone,
      ip,
      userAgent,
      outcome: error ? "blocked" : "allowed",
      detail: error ? `provider_error: ${error.message}` : null,
    });

    if (error) {
      console.error("otp send failed", error.message);
      return {
        ok: false as const,
        message: "Text sign-in isn't available right now. Use the email option below.",
        providerDown: true as const,
      };
    }

    return { ok: true as const, phone };
  });

export const verifyPhoneCode = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => verifySchema.parse(data))
  .handler(async ({ data }) => {
    const { ip, userAgent } = requestMeta();
    const { toUsCanadaE164 } = await import("./phone");
    const {
      getLockout,
      registerFailedCode,
      clearFailedCodes,
      logRateLimitEvent,
    } = await import("./rate-limit.server");

    const phone = toUsCanadaE164(data.phone);
    if (!phone) return { ok: false as const, message: "Enter a valid US or Canada number." };

    const locked = await getLockout(phone);
    if (locked) {
      await logRateLimitEvent({
        kind: "otp_verify_fail",
        phone,
        ip,
        userAgent,
        outcome: "blocked",
        detail: "locked_out",
      });
      return {
        ok: false as const,
        message: `Too many incorrect codes. Try again in ${locked} minutes or sign in by email.`,
      };
    }

    const { getServerAuthClient } = await import("./supabase-auth.server");
    const client = getServerAuthClient();
    const { data: result, error } = await client.auth.verifyOtp({
      phone,
      token: data.code,
      type: "sms",
    });

    if (error || !result.session) {
      const { attempts, lockedMinutes } = await registerFailedCode(phone);
      await logRateLimitEvent({
        kind: "otp_verify_fail",
        phone,
        ip,
        userAgent,
        outcome: "blocked",
        detail: `attempt_${attempts}`,
      });
      return {
        ok: false as const,
        message: lockedMinutes
          ? `That code isn't right. Sign-in for this number is locked for ${lockedMinutes} minutes.`
          : "That code isn't right. Check the message and try again.",
      };
    }

    await clearFailedCodes(phone);
    await logRateLimitEvent({ kind: "otp_verify_success", phone, ip, userAgent, outcome: "allowed" });

    // The browser turns these into a session; same-origin RPC, never logged.
    return {
      ok: true as const,
      accessToken: result.session.access_token,
      refreshToken: result.session.refresh_token,
    };
  });
