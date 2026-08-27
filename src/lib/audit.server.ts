/** Server-only admin audit trail. Append-only; nothing in the app deletes rows. */
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type AuditAction =
  | "customer_csv_export"
  | "customer_list_view"
  | "lead_list_view"
  | "admin_role_grant"
  | "admin_role_revoke"
  | "content_edit";

export async function recordAdminAction(params: {
  adminUserId: string;
  adminLabel?: string | null;
  action: AuditAction;
  targetType?: string | null;
  targetId?: string | null;
  rowCount?: number | null;
  detail?: Record<string, unknown>;
  ip?: string | null;
}) {
  const { error } = await supabaseAdmin.from("admin_audit_log").insert({
    admin_user_id: params.adminUserId,
    admin_label: params.adminLabel ?? null,
    action: params.action,
    target_type: params.targetType ?? null,
    target_id: params.targetId ?? null,
    row_count: params.rowCount ?? null,
    detail: params.detail ?? {},
    ip_address: params.ip ?? null,
  });
  if (error) console.error("audit log insert failed", error.message);
}
