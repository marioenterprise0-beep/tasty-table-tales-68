import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/PageHeader";
import { selectClass } from "@/components/form-bits";
import { formatPhone } from "@/lib/phone";
import {
  amIAdmin,
  listCustomers,
  listCustomerSources,
  listLeads,
  listAuditLog,
  exportCustomersCsv,
  changeAdminRole,
} from "@/lib/admin.functions";
import {
  getPublicMenu,
  getLocationSettings,
  updateMenuItem,
  updateMenuCategory,
  updateLocationSetting,
} from "@/lib/content.functions";
import type { LocationSettingRow, PublicMenuCategory, PublicMenuItem } from "@/lib/menu.types";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Gotham Halal" },
      { name: "description", content: "Internal Gotham Halal customer and lead dashboard." },
      { property: "og:title", content: "Admin — Gotham Halal" },
      { property: "og:description", content: "Internal dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type Tab = "customers" | "catering_leads" | "job_applications" | "franchise_inquiries" | "audit" | "menu" | "ordering";

const TABS: { id: Tab; label: string }[] = [
  { id: "customers", label: "Customers" },
  { id: "catering_leads", label: "Catering" },
  { id: "job_applications", label: "Careers" },
  { id: "franchise_inquiries", label: "Franchise" },
  { id: "audit", label: "Audit Log" },
  { id: "menu", label: "Menu" },
  { id: "ordering", label: "Ordering" },
];

/** Lead CSVs are built from rows the server already authorised and audited. */
function toCsv(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]!);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))].join("\n");
}

function download(name: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminPage() {
  const checkAdmin = useServerFn(amIAdmin);
  const { data: gate, isLoading: gateLoading } = useQuery({
    queryKey: ["am-i-admin"],
    queryFn: () => checkAdmin({ data: undefined }),
  });

  const [tab, setTab] = React.useState<Tab>("customers");

  if (gateLoading) return <p className="bg-ink px-5 py-24 text-center text-sm text-white/60">Checking access…</p>;
  if (!gate?.isAdmin) {
    return (
      <div className="bg-ink px-5 py-24 text-center">
        <h1 className="display text-2xl text-gold">Not authorized</h1>
        <p className="mt-3 text-sm text-white/70">This area is for Gotham Halal staff.</p>
      </div>
    );
  }

  return (
    <div className="bg-ink">
      <PageHeader eyebrow="Internal" title="Admin" blurb="Customers, consent and inbound leads." />
      <div className="mx-auto w-full max-w-[1400px] px-5 pb-24">
        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`display rounded-full border px-5 py-2 text-[11px] tracking-[0.12em] ${
                tab === t.id ? "border-gold bg-gold text-gold-foreground" : "border-gold/40 text-gold hover:bg-gold/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "customers" && <CustomersPanel />}
        {tab === "audit" && <AuditPanel />}
        {tab === "menu" && <MenuPanel />}
        {tab === "ordering" && <OrderingPanel />}
        {(tab === "catering_leads" || tab === "job_applications" || tab === "franchise_inquiries") && (
          <LeadsPanel type={tab} />
        )}
      </div>
    </div>
  );
}

function CustomersPanel() {
  const fetchCustomers = useServerFn(listCustomers);
  const fetchSources = useServerFn(listCustomerSources);
  const runExport = useServerFn(exportCustomersCsv);
  const [exporting, setExporting] = React.useState(false);
  const [exportNote, setExportNote] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [optIn, setOptIn] = React.useState<"all" | "sms" | "email" | "both" | "none">("all");
  const [source, setSource] = React.useState("");

  const { data: sources } = useQuery({
    queryKey: ["customer-sources"],
    queryFn: () => fetchSources({ data: undefined }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["customers", search, optIn, source],
    queryFn: () => fetchCustomers({ data: { search, optIn, source } }),
  });

  const rows = data?.rows ?? [];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-gold/25 bg-white/[0.03] p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">All customers</p>
          <p className="display text-2xl text-gold">{data?.counts.total ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-gold/25 bg-white/[0.03] p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">SMS eligible</p>
          <p className="display text-2xl text-gold">{data?.counts.smsEligible ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-gold/25 bg-white/[0.03] p-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/45">Email eligible</p>
          <p className="display text-2xl text-gold">{data?.counts.emailEligible ?? "—"}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search phone, name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select value={optIn} onChange={(e) => setOptIn(e.target.value as typeof optIn)} className={`${selectClass} max-w-[200px]`}>
          <option value="all">All opt-in states</option>
          <option value="sms">SMS opted in</option>
          <option value="email">Email opted in</option>
          <option value="both">Both</option>
          <option value="none">Neither</option>
        </select>
        <select value={source} onChange={(e) => setSource(e.target.value)} className={`${selectClass} max-w-[200px]`}>
          <option value="">All sources</option>
          {(sources ?? []).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={async () => {
            setExporting(true);
            setExportNote(null);
            try {
              // The server re-checks the admin role, rate limits and audits this.
              const result = await runExport({ data: { search, optIn, source } });
              if (!result.ok) setExportNote(result.message);
              else {
                download(`gotham-customers-${new Date().toISOString().slice(0, 10)}.csv`, result.csv);
                setExportNote(`Exported ${result.rowCount} rows — logged to the audit trail.`);
              }
            } catch {
              setExportNote("Export failed.");
            }
            setExporting(false);
          }}
          disabled={exporting || rows.length === 0}
          className="pill-gold px-6 py-2.5 text-[11px] disabled:opacity-50"
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
        {exportNote && <p className="w-full text-[12px] text-white/60">{exportNote}</p>}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/20">
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.14em] text-white/50">
            <tr>
              {["Name", "Phone", "Email", "SMS", "Email opt-in", "Source", "Created"].map((h) => (
                <th key={h} className="px-4 py-3 font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white/85">
            {isLoading && (
              <tr><td colSpan={7} className="px-4 py-6 text-white/50">Loading…</td></tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-6 text-white/50">No customers match.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="px-4 py-3">{[r.first_name, r.last_name].filter(Boolean).join(" ") || "—"}</td>
                <td className="px-4 py-3">{formatPhone(r.phone.startsWith("+") ? r.phone : null)}</td>
                <td className="px-4 py-3">{r.email || "—"}</td>
                <td className="px-4 py-3">{r.sms_opt_in ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{r.email_opt_in ? "Yes" : "No"}</td>
                <td className="px-4 py-3">{r.signup_source}</td>
                <td className="px-4 py-3">{new Date(r.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[11.5px] text-white/40">
        Read and export only — consent changes must come from the customer.
      </p>
    </div>
  );
}

function LeadsPanel({ type }: { type: Exclude<Tab, "customers"> }) {
  const fetchLeads = useServerFn(listLeads);
  const { data, isLoading } = useQuery({
    queryKey: ["leads", type],
    queryFn: () => fetchLeads({ data: { type } }),
  });

  const rows = data ?? [];
  const headers = rows[0] ? Object.keys(rows[0]) : [];

  return (
    <div>
      <button
        type="button"
        onClick={() => download(`gotham-${type}-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows))}
        disabled={rows.length === 0}
        className="pill-gold px-6 py-2.5 text-[11px] disabled:opacity-50"
      >
        Export CSV
      </button>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/20">
        <table className="w-full min-w-[900px] text-left text-[13px]">
          <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.14em] text-white/50">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 font-normal">{h.replace(/_/g, " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-white/85">
            {isLoading && <tr><td className="px-4 py-6 text-white/50">Loading…</td></tr>}
            {!isLoading && rows.length === 0 && <tr><td className="px-4 py-6 text-white/50">Nothing yet.</td></tr>}
            {rows.map((r, i) => (
              <tr key={String(r["id"] ?? i)} className="border-t border-white/5 align-top">
                {headers.map((h) => (
                  <td key={h} className="px-4 py-3">{r[h] === null ? "—" : String(r[h])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditPanel() {
  const fetchAudit = useServerFn(listAuditLog);
  const changeRole = useServerFn(changeAdminRole);
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin-audit"],
    queryFn: () => fetchAudit({ data: undefined }),
  });
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  async function submitRole(action: "grant" | "revoke") {
    setBusy(true);
    setNote(null);
    try {
      const result = await changeRole({ data: { email, action } });
      setNote(result.message);
      if (result.ok) {
        setEmail("");
        void refetch();
      }
    } catch (e) {
      setNote(e instanceof Error ? e.message : "That didn't work.");
    }
    setBusy(false);
  }

  const entries = data?.entries ?? [];
  const signIns = data?.signIns ?? [];
  const blocked = data?.blockedAttempts ?? [];

  return (
    <div className="space-y-10">
      <div className="rounded-xl border border-gold/25 bg-white/[0.03] p-5">
        <h2 className="display text-[13px] tracking-[0.14em] text-gold">Admin access</h2>
        <p className="mt-2 text-[12.5px] text-white/60">
          Grant or revoke staff admin access by account email. Every change is recorded below.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Input
            placeholder="staff@gothamhalal.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="max-w-xs"
          />
          <button
            type="button"
            disabled={busy || !email}
            onClick={() => void submitRole("grant")}
            className="pill-gold px-5 py-2.5 text-[11px] disabled:opacity-50"
          >
            Grant
          </button>
          <button
            type="button"
            disabled={busy || !email}
            onClick={() => void submitRole("revoke")}
            className="display rounded-full border border-gold/40 px-5 py-2.5 text-[11px] tracking-[0.12em] text-gold hover:bg-gold/10 disabled:opacity-50"
          >
            Revoke
          </button>
          {note && <p className="text-[12px] text-white/70">{note}</p>}
        </div>
      </div>

      <div>
        <h2 className="display mb-3 text-[13px] tracking-[0.14em] text-gold">Recent admin sign-ins</h2>
        <div className="overflow-x-auto rounded-xl border border-gold/20">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.14em] text-white/50">
              <tr>
                {["When", "Admin", "User ID", "IP"].map((h) => (
                  <th key={h} className="px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-white/85">
              {isLoading && <tr><td colSpan={4} className="px-4 py-6 text-white/50">Loading…</td></tr>}
              {!isLoading && signIns.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-white/50">No admin sign-ins recorded yet.</td></tr>
              )}
              {signIns.map((row) => (
                <tr key={row.id} className="border-t border-white/10">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(row.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">{row.admin_label ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-[11.5px] text-white/60">{row.target_id ?? "—"}</td>
                  <td className="px-4 py-3">{row.ip_address ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="display mb-3 text-[13px] tracking-[0.14em] text-gold">Admin activity (read-only)</h2>
        <div className="overflow-x-auto rounded-xl border border-gold/20">
          <table className="w-full min-w-[900px] text-left text-[13px]">
            <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.14em] text-white/50">
              <tr>
                {["When", "Admin", "Action", "Target", "Rows", "IP"].map((h) => (
                  <th key={h} className="px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-white/85">
              {isLoading && <tr><td colSpan={6} className="px-4 py-6 text-white/50">Loading…</td></tr>}
              {!isLoading && entries.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-white/50">No admin activity recorded yet.</td></tr>
              )}
              {entries.map((e) => (
                <tr key={e.id} className="border-t border-white/5">
                  <td className="px-4 py-3">{new Date(e.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">{e.admin_label ?? "—"}</td>
                  <td className="px-4 py-3">{e.action.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">{e.target_type ?? "—"}</td>
                  <td className="px-4 py-3">{e.row_count ?? "—"}</td>
                  <td className="px-4 py-3">{e.ip_address ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="display mb-3 text-[13px] tracking-[0.14em] text-gold">Blocked sign-in / export attempts</h2>
        <div className="overflow-x-auto rounded-xl border border-gold/20">
          <table className="w-full min-w-[800px] text-left text-[13px]">
            <thead className="bg-white/[0.04] text-[11px] uppercase tracking-[0.14em] text-white/50">
              <tr>
                {["When", "Kind", "Phone", "IP", "Reason"].map((h) => (
                  <th key={h} className="px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-white/85">
              {blocked.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-white/50">Nothing blocked recently.</td></tr>
              )}
              {blocked.map((b) => (
                <tr key={b.id} className="border-t border-white/5">
                  <td className="px-4 py-3">{new Date(b.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3">{b.kind.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">{b.phone ? formatPhone(b.phone) : "—"}</td>
                  <td className="px-4 py-3">{b.ip_address ?? "—"}</td>
                  <td className="px-4 py-3">{b.detail ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ---------- Menu management ----------

function MenuPanel() {
  const queryClient = useQueryClient();
  const saveItem = useServerFn(updateMenuItem);
  const saveCategory = useServerFn(updateMenuCategory);

  const { data: menu, isLoading } = useQuery({
    queryKey: ["public-menu"],
    queryFn: () => getPublicMenu(),
  });
  const [edits, setEdits] = React.useState<Record<string, Partial<PublicMenuItem>>>({});
  const [saving, setSaving] = React.useState<string | null>(null);
  const [catSlugEdits, setCatSlugEdits] = React.useState<Record<string, string>>({});

  if (isLoading || !menu) return <p className="text-sm text-white/60">Loading menu…</p>;

  const patch = (id: string, p: Partial<PublicMenuItem>) =>
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...p } }));

  const save = async (item: PublicMenuItem) => {
    const e = edits[item.id];
    if (!e) return;
    setSaving(item.id);
    try {
      await saveItem({
        data: {
          id: item.id,
          name: (e.name ?? item.name).trim(),
          description: (e.description ?? item.description).trim(),
          price: Number(e.price ?? item.price),
          cardPrice: e.cardPrice === undefined ? (item.cardPrice === null ? null : Number(item.cardPrice)) : (e.cardPrice === "" || e.cardPrice === null ? null : Number(e.cardPrice)),
          isVegetarian: e.isVegetarian ?? item.isVegetarian,
          isFeatured: e.isFeatured ?? item.isFeatured,
          isActive: e.isActive ?? item.isActive,
          displayOrder: e.displayOrder ?? item.displayOrder,
        },
      });
      setEdits((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
      await queryClient.invalidateQueries({ queryKey: ["public-menu"] });
      toast.success("Item saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setSaving(null);
    }
  };

  const saveCat = async (cat: PublicMenuCategory) => {
    const slug = (catSlugEdits[cat.id] ?? cat.orderCategorySlug ?? "").trim();
    try {
      await saveCategory({ data: { id: cat.id, orderCategorySlug: slug || null } });
      await queryClient.invalidateQueries({ queryKey: ["public-menu"] });
      toast.success("Category saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save.");
    }
  };

  const fieldClass =
    "w-full rounded-md border border-gold/25 bg-white/[0.04] px-2.5 py-1.5 text-sm text-cream placeholder:text-white/30 focus:border-gold focus:outline-none";

  return (
    <div className="space-y-10">
      <div className="rounded-xl border border-gold/25 bg-white/[0.03] p-5">
        <h2 className="display text-sm tracking-[0.14em] text-gold">POS CATEGORY LINKS</h2>
        <p className="mt-1 text-xs text-white/55">
          The ordering deep link is the POS category slug, e.g. <code className="text-gold/90">gotham-burgers</code>. Leave blank to send that section to the main ordering page.
        </p>
        <ul className="mt-4 space-y-3">
          {menu.categories.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-3">
              <span className="display w-56 text-xs tracking-[0.08em] text-cream">{c.name}</span>
              <input
                value={catSlugEdits[c.id] ?? c.orderCategorySlug ?? ""}
                onChange={(e) => setCatSlugEdits((p) => ({ ...p, [c.id]: e.target.value }))}
                placeholder="category-slug"
                className={`${fieldClass} max-w-xs`}
              />
              <button type="button" onClick={() => saveCat(c)} className="display rounded-full border border-gold/50 px-4 py-1.5 text-[10px] tracking-[0.14em] text-gold hover:bg-gold hover:text-ink">
                Save
              </button>
            </li>
          ))}
        </ul>
      </div>

      {menu.categories.map((c) => (
        <div key={c.id} className="rounded-xl border border-gold/25 bg-white/[0.03] p-5">
          <h2 className="display text-sm tracking-[0.14em] text-gold">{c.name.toUpperCase()}</h2>
          <div className="mt-4 space-y-4">
            {menu.items.filter((i) => i.categoryId === c.id).map((i) => {
              const e = edits[i.id] ?? {};
              const dirty = edits[i.id] !== undefined;
              return (
                <div key={i.id} className="rounded-lg border border-white/10 p-4">
                  <div className="grid gap-3 lg:grid-cols-[1fr_1.6fr]">
                    <input value={e.name ?? i.name} onChange={(ev) => patch(i.id, { name: ev.target.value })} className={fieldClass} aria-label="Item name" />
                    <input value={e.description ?? i.description} onChange={(ev) => patch(i.id, { description: ev.target.value })} className={fieldClass} aria-label="Description" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <label className="flex items-center gap-2 text-white/70">
                      Cash $
                      <input type="number" step="0.01" min="0" value={e.price ?? i.price} onChange={(ev) => patch(i.id, { price: ev.target.value })} className={`${fieldClass} w-24`} />
                    </label>
                    <label className="flex items-center gap-2 text-white/70">
                      Card $
                      <input type="number" step="0.01" min="0" value={e.cardPrice ?? i.cardPrice ?? ""} onChange={(ev) => patch(i.id, { cardPrice: ev.target.value })} placeholder="—" className={`${fieldClass} w-24`} />
                    </label>
                    <label className="flex items-center gap-2 text-white/70">
                      <input type="checkbox" checked={e.isVegetarian ?? i.isVegetarian} onChange={(ev) => patch(i.id, { isVegetarian: ev.target.checked })} />
                      Vegetarian
                    </label>
                    <label className="flex items-center gap-2 text-white/70">
                      <input type="checkbox" checked={e.isFeatured ?? i.isFeatured} onChange={(ev) => patch(i.id, { isFeatured: ev.target.checked })} />
                      Featured
                    </label>
                    <label className="flex items-center gap-2 text-white/70">
                      <input type="checkbox" checked={e.isActive ?? i.isActive} onChange={(ev) => patch(i.id, { isActive: ev.target.checked })} />
                      Live on menu
                    </label>
                    <label className="flex items-center gap-2 text-white/70">
                      Order
                      <input type="number" step="1" min="0" value={e.displayOrder ?? i.displayOrder} onChange={(ev) => patch(i.id, { displayOrder: Number(ev.target.value) })} className={`${fieldClass} w-20`} />
                    </label>
                    <button
                      type="button"
                      disabled={!dirty || saving === i.id}
                      onClick={() => save(i)}
                      className="display rounded-full bg-gold px-5 py-1.5 text-[10px] tracking-[0.14em] text-ink disabled:opacity-40"
                    >
                      {saving === i.id ? "Saving…" : "Save"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Ordering / locations ----------

function OrderingPanel() {
  const queryClient = useQueryClient();
  const save = useServerFn(updateLocationSetting);
  const { data, isLoading } = useQuery({ queryKey: ["location-settings"], queryFn: () => getLocationSettings() });
  const [edits, setEdits] = React.useState<Record<string, { orderUrl?: string; isOrderEnabled?: boolean }>>({});
  const [saving, setSaving] = React.useState<string | null>(null);

  if (isLoading || !data) return <p className="text-sm text-white/60">Loading locations…</p>;

  const run = async (row: LocationSettingRow) => {
    const e = edits[row.location_slug] ?? {};
    setSaving(row.location_slug);
    try {
      await save({
        data: {
          locationSlug: row.location_slug,
          orderUrl: (e.orderUrl ?? row.order_url).trim(),
          isOrderEnabled: e.isOrderEnabled ?? row.is_order_enabled,
        },
      });
      setEdits((prev) => { const n = { ...prev }; delete n[row.location_slug]; return n; });
      await queryClient.invalidateQueries({ queryKey: ["location-settings"] });
      toast.success("Location saved.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-xs text-white/55">
        These drive the “Which location?” picker and every Order button. Turning off a location greys it out for customers.
      </p>
      {data.map((row) => {
        const e = edits[row.location_slug] ?? {};
        return (
          <div key={row.location_slug} className="rounded-xl border border-gold/25 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-center gap-4">
              <span className="display w-40 text-sm tracking-[0.1em] text-gold">{row.location_slug.toUpperCase().replace(/-/g, " ")}</span>
              <input
                value={e.orderUrl ?? row.order_url}
                onChange={(ev) => setEdits((p) => ({ ...p, [row.location_slug]: { ...p[row.location_slug], orderUrl: ev.target.value } }))}
                className="min-w-0 flex-1 rounded-md border border-gold/25 bg-white/[0.04] px-3 py-2 text-sm text-cream focus:border-gold focus:outline-none"
                aria-label="Ordering URL"
              />
              <label className="flex items-center gap-2 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={e.isOrderEnabled ?? row.is_order_enabled}
                  onChange={(ev) => setEdits((p) => ({ ...p, [row.location_slug]: { ...p[row.location_slug], isOrderEnabled: ev.target.checked } }))}
                />
                Ordering enabled
              </label>
              <button
                type="button"
                disabled={saving === row.location_slug}
                onClick={() => run(row)}
                className="display rounded-full bg-gold px-5 py-2 text-[10px] tracking-[0.14em] text-ink disabled:opacity-40"
              >
                {saving === row.location_slug ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
