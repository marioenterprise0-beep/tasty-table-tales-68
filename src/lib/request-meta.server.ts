import { getRequestHeader } from "@tanstack/react-start/server";

/** Server-only request metadata (IP + user agent) for audit logging. */
export function readRequestMeta() {
  const forwarded = getRequestHeader("x-forwarded-for") ?? "";
  const ip =
    forwarded.split(",")[0]?.trim() || getRequestHeader("cf-connecting-ip") || null;
  return { ip, userAgent: getRequestHeader("user-agent") ?? null };
}
