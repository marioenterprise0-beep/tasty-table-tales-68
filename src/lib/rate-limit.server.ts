/**
 * Server-only abuse controls.
 *
 * These exist because the SMS one-time-code endpoint is the classic target for
 * "SMS pumping" fraud: an attacker loops signup requests against premium-rate
 * numbers and the restaurant pays for every message. Every limit below is
 * enforced on the server, before a message can be sent, and every attempt is
 * logged so patterns are visible after the fact.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const OTP_LIMITS = {
  perPhonePerHour: 3,
  perPhonePerDay: 10,
  perIpPerHour: 5,
  failedAttemptsBeforeLock: 3,
  lockoutMinutes: 30,
} as const;

export const EXPORT_LIMIT_PER_DAY = 10;

export type RateLimitKind =
  | "otp_request"
  | "otp_verify_fail"
  | "otp_verify_success"
  | "customer_export";

export type LogEntry = {
  kind: RateLimitKind;
  phone?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  actorUserId?: string | null;
  outcome: "allowed" | "blocked";
  detail?: string | null;
};

export async function logRateLimitEvent(entry: LogEntry) {
  const { error } = await supabaseAdmin.from("rate_limit_log").insert({
    kind: entry.kind,
    phone: entry.phone ?? null,
    ip_address: entry.ip ?? null,
    user_agent: entry.userAgent ?? null,
    actor_user_id: entry.actorUserId ?? null,
    outcome: entry.outcome,
    detail: entry.detail ?? null,
  });
  if (error) console.error("rate limit log insert failed", error.message);
}

async function countSince(params: {
  kind: RateLimitKind;
  column: "phone" | "ip_address" | "actor_user_id";
  value: string;
  sinceMs: number;
}) {
  const since = new Date(Date.now() - params.sinceMs).toISOString();
  const { count, error } = await supabaseAdmin
    .from("rate_limit_log")
    .select("id", { count: "exact", head: true })
    .eq("kind", params.kind)
    .eq(params.column, params.value)
    .eq("outcome", "allowed")
    .gte("created_at", since);
  if (error) {
    console.error("rate limit count failed", error.message);
    // Fail closed: if we cannot prove the caller is under the limit, block.
    return Number.MAX_SAFE_INTEGER;
  }
  return count ?? 0;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export type LimitResult = { ok: true } | { ok: false; reason: string; retryAfterMinutes: number };

/** Full pre-send gate for a one-time-code request. */
export async function checkOtpAllowed(phone: string, ip: string | null): Promise<LimitResult> {
  const lock = await getLockout(phone);
  if (lock) {
    return {
      ok: false,
      reason: `Too many incorrect codes. Try again in ${lock} minutes or sign in by email.`,
      retryAfterMinutes: lock,
    };
  }

  const phoneHour = await countSince({ kind: "otp_request", column: "phone", value: phone, sinceMs: HOUR });
  if (phoneHour >= OTP_LIMITS.perPhonePerHour) {
    return {
      ok: false,
      reason: "That number has requested too many codes in the last hour. Try again later.",
      retryAfterMinutes: 60,
    };
  }

  const phoneDay = await countSince({ kind: "otp_request", column: "phone", value: phone, sinceMs: DAY });
  if (phoneDay >= OTP_LIMITS.perPhonePerDay) {
    return {
      ok: false,
      reason: "That number has hit today's limit for sign-in codes. Try again tomorrow.",
      retryAfterMinutes: 24 * 60,
    };
  }

  if (ip) {
    const ipHour = await countSince({ kind: "otp_request", column: "ip_address", value: ip, sinceMs: HOUR });
    if (ipHour >= OTP_LIMITS.perIpPerHour) {
      return {
        ok: false,
        reason: "Too many sign-in attempts from this network. Try again in an hour.",
        retryAfterMinutes: 60,
      };
    }
  }

  return { ok: true };
}

/** Minutes remaining on an active lockout, or null when the number is free. */
export async function getLockout(phone: string): Promise<number | null> {
  const { data } = await supabaseAdmin
    .from("otp_lockouts")
    .select("locked_until")
    .eq("phone", phone)
    .maybeSingle();
  if (!data?.locked_until) return null;
  const remaining = new Date(data.locked_until).getTime() - Date.now();
  if (remaining <= 0) return null;
  return Math.max(1, Math.ceil(remaining / 60000));
}

/**
 * Records a wrong code. Backoff doubles each time past the threshold
 * (30 min, 60, 120 …) so repeat offenders get progressively colder.
 */
export async function registerFailedCode(phone: string) {
  const { data: existing } = await supabaseAdmin
    .from("otp_lockouts")
    .select("id, failed_attempts")
    .eq("phone", phone)
    .maybeSingle();

  const attempts = (existing?.failed_attempts ?? 0) + 1;
  let lockedUntil: string | null = null;
  if (attempts >= OTP_LIMITS.failedAttemptsBeforeLock) {
    const over = attempts - OTP_LIMITS.failedAttemptsBeforeLock;
    const minutes = OTP_LIMITS.lockoutMinutes * Math.pow(2, Math.min(over, 4));
    lockedUntil = new Date(Date.now() + minutes * 60000).toISOString();
  }

  const row = {
    phone,
    failed_attempts: attempts,
    last_failed_at: new Date().toISOString(),
    locked_until: lockedUntil,
  };
  const { error } = await supabaseAdmin.from("otp_lockouts").upsert(row, { onConflict: "phone" });
  if (error) console.error("lockout upsert failed", error.message);

  return { attempts, lockedMinutes: lockedUntil ? OTP_LIMITS.lockoutMinutes : 0 };
}

/** A correct code clears the slate for that number. */
export async function clearFailedCodes(phone: string) {
  await supabaseAdmin.from("otp_lockouts").delete().eq("phone", phone);
}

/** Admin CSV exports: 10 per admin per rolling day. */
export async function checkExportAllowed(userId: string): Promise<LimitResult> {
  const used = await countSince({
    kind: "customer_export",
    column: "actor_user_id",
    value: userId,
    sinceMs: DAY,
  });
  if (used >= EXPORT_LIMIT_PER_DAY) {
    return {
      ok: false,
      reason: `Export limit reached (${EXPORT_LIMIT_PER_DAY} per day). Try again tomorrow.`,
      retryAfterMinutes: 24 * 60,
    };
  }
  return { ok: true };
}
