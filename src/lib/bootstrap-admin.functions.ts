import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  phone: z.string(),
  password: z.string().min(12),
  firstName: z.string(),
});

export const bootstrapAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    let user = list?.users.find((u) => u.email?.toLowerCase() === data.email.toLowerCase());

    if (!user) {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        phone: data.phone,
        password: data.password,
        email_confirm: true,
        phone_confirm: true,
      });
      if (error) throw new Error(`createUser: ${error.message}`);
      user = created.user;
    } else {
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: data.password,
        phone: data.phone,
        email_confirm: true,
        phone_confirm: true,
      });
    }
    if (!user) throw new Error("no user");

    const now = new Date().toISOString();
    const { data: existing } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("phone", data.phone)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from("customers")
        .update({
          user_id: user.id,
          email: data.email,
          email_verified: true,
          phone_verified: true,
          first_name: data.firstName,
          last_sign_in_at: now,
        })
        .eq("id", existing.id);
    } else {
      const { error } = await supabaseAdmin.from("customers").insert({
        user_id: user.id,
        phone: data.phone,
        email: data.email,
        email_verified: true,
        phone_verified: true,
        first_name: data.firstName,
        signup_source: "admin_bootstrap",
      });
      if (error) throw new Error(`customer: ${error.message}`);
    }

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: user.id, role: "admin" }, { onConflict: "user_id,role" });
    if (roleError) throw new Error(`role: ${roleError.message}`);

    return { ok: true, userId: user.id, email: user.email };
  });
