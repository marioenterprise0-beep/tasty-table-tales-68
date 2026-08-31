import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { customerFiltersSchema } from "./customers.schemas";
import { z } from "zod";

export type AuthedContext = {
  supabase: { rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }> };
  userId: string;
  claims: Record<string, unknown>;
};

/**
 * Reads request metadata. The server-only header helper is imported lazily so
 * this module stays safe to import from client-side route files.
 */
async function requestMeta() {
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  const forwarded = getRequestHeader("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || getRequestHeader("cf-connecting-ip") || null;
  return { ip, userAgent: getRequestHeader("user-agent") ?? null };
}


/**
 * Every admin server function re-checks the role on every call, through the
 * CALLER's own RLS-scoped client — never the service-role client. Hiding a
 * button in the UI is not access control.
 */
export async function assertAdmin(context: AuthedContext) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: admin access required.");
  const claims = context.claims as { email?: string; phone?: string };
  return {
    adminUserId: context.userId,
    adminLabel: claims.email ?? claims.phone ?? context.userId,
    ip: (await requestMeta()).ip,
  };
}

export const amIAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data) };
  });

const CUSTOMER_COLUMNS =
  "id, phone, first_name, last_name, email, email_verified, sms_opt_in, email_opt_in, sms_consent_timestamp, email_consent_timestamp, phone_verified, signup_source, created_at";

async function queryCustomers(filters: z.infer<typeof customerFiltersSchema>) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  let query = supabaseAdmin
    .from("customers")
    .select(CUSTOMER_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(5000);

  if (filters.optIn === "sms") query = query.eq("sms_opt_in", true);
  if (filters.optIn === "email") query = query.eq("email_opt_in", true);
  if (filters.optIn === "both") query = query.eq("sms_opt_in", true).eq("email_opt_in", true);
  if (filters.optIn === "none") query = query.eq("sms_opt_in", false).eq("email_opt_in", false);
  if (filters.source) query = query.eq("signup_source", filters.source);
  if (filters.search) {
    const term = `%${filters.search.replace(/[%,]/g, "")}%`;
    query = query.or(
      `phone.ilike.${term},first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term}`,
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("customer query failed", error.message);
    throw new Error("Couldn't load customers.");
  }
  return data ?? [];
}

export const listCustomers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => customerFiltersSchema.parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context as unknown as AuthedContext);
    const rows = (await queryCustomers(data)).slice(0, 2000);

    const { recordAdminAction } = await import("./audit.server");
    const meta = await requestMeta();
    await recordAdminAction({
      adminUserId: admin.adminUserId,
      adminLabel: admin.adminLabel,
      action: "customer_list_view",
      targetType: "customers",
      rowCount: rows.length,
      detail: { search: data.search || null, optIn: data.optIn, source: data.source || null },
      ip: admin.ip,
    });

    return {
      rows,
      counts: {
        total: rows.length,
        smsEligible: rows.filter((r) => r.sms_opt_in).length,
        emailEligible: rows.filter((r) => r.email_opt_in && r.email).length,
      },
    };
  });

/**
 * CSV is built on the server after a fresh role check, rate limited to 10 per
 * admin per day, and written to the audit log with the exact row count.
 */
export const exportCustomersCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => customerFiltersSchema.parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context as unknown as AuthedContext);
    const { checkExportAllowed, logRateLimitEvent } = await import("./rate-limit.server");
    const { recordAdminAction } = await import("./audit.server");
    const meta = await requestMeta();

    const gate = await checkExportAllowed(admin.adminUserId);
    if (!gate.ok) {
      await logRateLimitEvent({
        kind: "customer_export",
        actorUserId: admin.adminUserId,
        ip: admin.ip,
        outcome: "blocked",
        detail: gate.reason,
      });
      return { ok: false as const, message: gate.reason };
    }

    const rows = await queryCustomers(data);
    const headers = [
      "phone",
      "first_name",
      "last_name",
      "email",
      "email_verified",
      "sms_opt_in",
      "email_opt_in",
      "sms_consent_timestamp",
      "email_consent_timestamp",
      "phone_verified",
      "signup_source",
      "created_at",
    ] as const;
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => escape((r as Record<string, unknown>)[h])).join(",")),
    ].join("\n");

    await logRateLimitEvent({
      kind: "customer_export",
      actorUserId: admin.adminUserId,
      ip: admin.ip,
      outcome: "allowed",
      detail: `${rows.length} rows`,
    });
    await recordAdminAction({
      adminUserId: admin.adminUserId,
      adminLabel: admin.adminLabel,
      action: "customer_csv_export",
      targetType: "customers",
      rowCount: rows.length,
      detail: { search: data.search || null, optIn: data.optIn, source: data.source || null },
      ip: admin.ip,
    });

    return { ok: true as const, csv, rowCount: rows.length };
  });

export const listCustomerSources = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.from("customers").select("signup_source").limit(5000);
    return Array.from(new Set((data ?? []).map((r) => r.signup_source))).sort();
  });

const leadTypeSchema = z.object({
  type: z.enum(["catering_leads", "job_applications", "franchise_inquiries"]),
});

export const listLeads = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => leadTypeSchema.parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context as unknown as AuthedContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from(data.type)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) {
      console.error("lead list failed", error.message);
      throw new Error("Couldn't load leads.");
    }

    const { recordAdminAction } = await import("./audit.server");
    const meta = await requestMeta();
    await recordAdminAction({
      adminUserId: admin.adminUserId,
      adminLabel: admin.adminLabel,
      action: "lead_list_view",
      targetType: data.type,
      rowCount: rows?.length ?? 0,
      ip: admin.ip,
    });

    return (rows ?? []) as unknown as Record<string, string | number | boolean | null>[];
  });

export const listAuditLog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as unknown as AuthedContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [audit, limits] = await Promise.all([
      supabaseAdmin
        .from("admin_audit_log")
        .select("id, admin_label, action, target_type, target_id, row_count, detail, ip_address, created_at")
        .order("created_at", { ascending: false })
        .limit(300),
      supabaseAdmin
        .from("rate_limit_log")
        .select("id, kind, phone, ip_address, outcome, detail, created_at")
        .eq("outcome", "blocked")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    return {
      entries: audit.data ?? [],
      signIns: (audit.data ?? []).filter((e) => e.action === "admin_sign_in").slice(0, 25),
      blockedAttempts: limits.data ?? [],
    };
  });

/**
 * Records an admin sign-in (time, IP, user id). Called right after a session is
 * established; a no-op for non-admin customers, and de-duplicated within a
 * 5-minute window so a page refresh doesn't spam the trail.
 */
export const recordAdminSignIn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as AuthedContext;
    const { data: isAdmin } = await ctx.supabase.rpc("has_role", {
      _user_id: ctx.userId,
      _role: "admin",
    });
    if (!isAdmin) return { logged: false as const };

    const claims = ctx.claims as { email?: string; phone?: string };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recent } = await supabaseAdmin
      .from("admin_audit_log")
      .select("id")
      .eq("admin_user_id", ctx.userId)
      .eq("action", "admin_sign_in")
      .gte("created_at", since)
      .limit(1);
    if (recent && recent.length > 0) return { logged: false as const };

    const { recordAdminAction } = await import("./audit.server");
    const meta = await requestMeta();
    await recordAdminAction({
      adminUserId: ctx.userId,
      adminLabel: claims.email ?? claims.phone ?? ctx.userId,
      action: "admin_sign_in",
      targetType: "session",
      targetId: ctx.userId,
      ip: meta.ip,
      detail: { userAgent: meta.userAgent },
    });
    return { logged: true as const };
  });

const roleChangeSchema = z.object({
  email: z.string().trim().email().max(255),
  action: z.enum(["grant", "revoke"]),
});

/** Admin role changes are themselves an audited admin action. */
export const changeAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => roleChangeSchema.parse(data))
  .handler(async ({ data, context }) => {
    const admin = await assertAdmin(context as unknown as AuthedContext);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { recordAdminAction } = await import("./audit.server");
    const meta = await requestMeta();

    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (listError) throw new Error("Couldn't look up that user.");
    const target = users.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());
    if (!target) return { ok: false as const, message: "No account found with that email." };

    if (data.action === "revoke" && target.id === admin.adminUserId) {
      return { ok: false as const, message: "You can't revoke your own admin access." };
    }

    if (data.action === "grant") {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: target.id, role: "admin" }, { onConflict: "user_id,role" });
      if (error) throw new Error("Couldn't grant admin access.");
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", target.id)
        .eq("role", "admin");
      if (error) throw new Error("Couldn't revoke admin access.");
    }

    await recordAdminAction({
      adminUserId: admin.adminUserId,
      adminLabel: admin.adminLabel,
      action: data.action === "grant" ? "admin_role_grant" : "admin_role_revoke",
      targetType: "user",
      targetId: target.id,
      detail: { email: data.email },
      ip: admin.ip,
    });

    return { ok: true as const, message: `Admin access ${data.action === "grant" ? "granted to" : "revoked from"} ${data.email}.` };
  });
