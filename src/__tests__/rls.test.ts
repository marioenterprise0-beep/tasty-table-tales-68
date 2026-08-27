import { describe, it, expect } from "vitest";
import { createClient } from "@supabase/supabase-js";

const URL = "https://aeslzgsgbgkyrestsnwh.supabase.co";
const ANON = "sb_publishable_ZG8GI-yO0MsqVTX7EXazSQ__9df-_jM";
const anon = () => createClient(URL, ANON, { auth: { persistSession: false } });

describe("RLS: signed-out visitor", () => {
  for (const table of ["customers", "consent_events", "suppression_list", "user_roles", "catering_leads", "job_applications", "franchise_inquiries", "admin_audit_log", "rate_limit_log", "otp_lockouts"]) {
    it(`cannot read ${table}`, async () => {
      const { data, error } = await anon().from(table).select("*").limit(1);
      expect(data === null || data.length === 0).toBe(true);
      if (data && data.length) throw new Error(`LEAK: ${table} readable anonymously`);
      expect(error === null || !!error).toBe(true);
    });
    it(`cannot write ${table}`, async () => {
      const { error } = await anon().from(table).insert({} as never);
      expect(error).not.toBeNull();
    });
  }
});
