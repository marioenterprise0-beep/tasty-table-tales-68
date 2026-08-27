import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { customerFiltersSchema } from "./customers.schemas";
import { z } from "zod";

async function assertAdmin(context: { supabase: { rpc: Function }; userId: string }) {
  const { data, error } = await (context.supabase.rpc as (
    fn: string,
    args: Record<string, unknown>,
  ) => Promise<{ data: boolean | null; error: unknown }>)("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden: admin access required.");
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

export const listCustomers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => customerFiltersSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let query = supabaseAdmin
      .from("customers")
      .select(
        "id, phone, first_name, last_name, email, sms_opt_in, email_opt_in, sms_consent_timestamp, email_consent_timestamp, phone_verified, signup_source, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(2000);

    if (data.optIn === "sms") query = query.eq("sms_opt_in", true);
    if (data.optIn === "email") query = query.eq("email_opt_in", true);
    if (data.optIn === "both") query = query.eq("sms_opt_in", true).eq("email_opt_in", true);
    if (data.optIn === "none") query = query.eq("sms_opt_in", false).eq("email_opt_in", false);
    if (data.source) query = query.eq("signup_source", data.source);
    if (data.search) {
      const term = `%${data.search.replace(/[%,]/g, "")}%`;
      query = query.or(
        `phone.ilike.${term},first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term}`,
      );
    }

    const { data: rows, error } = await query;
    if (error) {
      console.error("customer list failed", error.message);
      throw new Error("Couldn't load customers.");
    }

    const all = rows ?? [];
    return {
      rows: all,
      counts: {
        total: all.length,
        smsEligible: all.filter((r) => r.sms_opt_in).length,
        emailEligible: all.filter((r) => r.email_opt_in && r.email).length,
      },
    };
  });

export const listCustomerSources = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
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
    await assertAdmin(context);
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
    return (rows ?? []) as unknown as Record<string, string | number | boolean | null>[];
  });
