import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const URL = process.env["SUPABASE_URL"]!;
const ANON = "sb_publishable_ZG8GI-yO0MsqVTX7EXazSQ__9df-_jM";
const SERVICE = process.env["SUPABASE_SERVICE_ROLE_KEY"]!;
const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });

const mk = () => `rlstest_${crypto.randomUUID().slice(0, 8)}@example.com`;
let userA = { id: "", email: mk(), password: "Test-Pass-9182!" };
let userB = { id: "", email: mk(), password: "Test-Pass-9182!" };
let clientA: ReturnType<typeof createClient>;

async function createUser(u: { email: string; password: string }) {
  const { data, error } = await admin.auth.admin.createUser({
    email: u.email, password: u.password, email_confirm: true,
  });
  if (error) throw error;
  return data.user!.id;
}

beforeAll(async () => {
  userA.id = await createUser(userA);
  userB.id = await createUser(userB);
  await admin.from("customers").insert([
    { user_id: userA.id, phone: `+1585${Math.floor(1000000 + Math.random() * 8999999)}`, first_name: "A" },
    { user_id: userB.id, phone: `+1585${Math.floor(1000000 + Math.random() * 8999999)}`, first_name: "B" },
  ]);
  clientA = createClient(URL, ANON, { auth: { persistSession: false } });
  const { error } = await clientA.auth.signInWithPassword({ email: userA.email, password: userA.password });
  if (error) throw error;
}, 60000);

afterAll(async () => {
  await admin.from("customers").delete().in("user_id", [userA.id, userB.id]);
  await admin.auth.admin.deleteUser(userA.id);
  await admin.auth.admin.deleteUser(userB.id);
});

describe("RLS: authenticated non-admin customer", () => {
  it("reads only their own customer row", async () => {
    const { data } = await clientA.from("customers").select("user_id");
    expect(data?.length).toBe(1);
    expect(data?.[0]!["user_id"]).toBe(userA.id);
  });

  it("cannot read another customer by id", async () => {
    const { data } = await clientA.from("customers").select("id").eq("user_id", userB.id);
    expect(data?.length ?? 0).toBe(0);
  });

  it("cannot update another customer's row", async () => {
    const { data } = await clientA.from("customers").update({ first_name: "HACKED" }).eq("user_id", userB.id).select();
    expect(data?.length ?? 0).toBe(0);
    const { data: check } = await admin.from("customers").select("first_name").eq("user_id", userB.id).single();
    expect(check!["first_name"]).toBe("B");
  });

  it("cannot read admin-only tables", async () => {
    for (const t of ["consent_events", "suppression_list", "admin_audit_log", "rate_limit_log", "catering_leads", "job_applications", "franchise_inquiries"]) {
      const { data } = await clientA.from(t).select("*").limit(1);
      expect(data?.length ?? 0, `${t} leaked to non-admin`).toBe(0);
    }
  });

  it("cannot grant itself an admin role", async () => {
    const { error } = await clientA.from("user_roles").insert({ user_id: userA.id, role: "admin" });
    expect(error).not.toBeNull();
    const { data } = await admin.from("user_roles").select("id").eq("user_id", userA.id);
    expect(data?.length ?? 0).toBe(0);
  });

  it("has_role reports false for a non-admin", async () => {
    const { data } = await clientA.rpc("has_role", { _user_id: userA.id, _role: "admin" });
    expect(data).toBe(false);
  });
});
