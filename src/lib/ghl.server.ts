/**
 * Go High Level API v2 helper.
 *
 * This module is server-only. It is dynamically imported from server-function
 * handlers so it never leaks into the client bundle.
 */

import { normalizePhone } from "./phone";

const API_BASE = "https://services.leadconnectorhq.com";

function getCredentials() {
  const token = process.env["GHL_PRIVATE_INTEGRATION_TOKEN"];
  const locationId = process.env["GHL_LOCATION_ID"];
  if (!token || !locationId) {
    console.warn("[ghl] missing GHL_PRIVATE_INTEGRATION_TOKEN or GHL_LOCATION_ID; skipping sync");
    return null;
  }
  return { token, locationId };
}

async function ghlFetch(path: string, init: RequestInit) {
  const creds = getCredentials();
  if (!creds) return null;

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${creds.token}`,
      Version: "2021-07-28",
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`[ghl] ${init.method ?? "GET"} ${path} failed [${response.status}]: ${body}`);
    return null;
  }

  const text = await response.text();
  try {
    return text ? (JSON.parse(text) as unknown) : null;
  } catch {
    return null;
  }
}

async function findContactByEmail(email: string) {
  const creds = getCredentials();
  if (!creds) return null;

  const query = new URLSearchParams({ location_id: creds.locationId, email: email.toLowerCase() });
  const data = (await ghlFetch(`/contacts/?${query.toString()}`, { method: "GET" })) as
    | { contacts: Array<{ id: string; email?: string; phone?: string }> }
    | undefined;
  return data?.contacts?.[0] ?? null;
}

async function findContactByPhone(phone: string) {
  const creds = getCredentials();
  if (!creds) return null;

  const normalized = normalizePhone(phone);
  if (!normalized) return null;

  const query = new URLSearchParams({ location_id: creds.locationId, phone: normalized });
  const data = (await ghlFetch(`/contacts/?${query.toString()}`, { method: "GET" })) as
    | { contacts: Array<{ id: string; email?: string; phone?: string }> }
    | undefined;
  return data?.contacts?.[0] ?? null;
}

export type GhlContactInput = {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  source?: string;
  tags?: string[];
  customFields?: Record<string, string | number | boolean | null>;
};

export async function upsertGhlContact(input: GhlContactInput) {
  const creds = getCredentials();
  if (!creds) return { ok: false as const, skipped: true as const, id: null };

  const email = input.email?.trim().toLowerCase() || null;
  const phone = normalizePhone(input.phone);

  const existing = email ? await findContactByEmail(email) : phone ? await findContactByPhone(phone) : null;

  const tags = Array.from(new Set(["Gotham Halal Website", ...(input.tags ?? [])]));
  const body: Record<string, unknown> = {
    locationId: creds.locationId,
    firstName: input.firstName || undefined,
    lastName: input.lastName || undefined,
    email: email || undefined,
    phone: phone || undefined,
    source: input.source || "gothamhalal.com",
    tags,
  };

  if (input.customFields && Object.keys(input.customFields).length > 0) {
    body.customFields = Object.entries(input.customFields)
      .filter(([, v]) => v !== null && v !== undefined && v !== "")
      .map(([key, value]) => ({ key, field_value: value }));
  }

  if (existing?.id) {
    const current = (await ghlFetch(`/contacts/${existing.id}`, { method: "GET" })) as
      | { contact: { tags?: string[] } }
      | undefined;
    const mergedTags = Array.from(new Set([...(current?.contact?.tags ?? []), ...tags]));
    body.tags = mergedTags;

    const result = await ghlFetch(`/contacts/${existing.id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    if (!result) return { ok: false as const, skipped: false as const, id: null };
    return { ok: true as const, skipped: false as const, id: existing.id };
  }

  const result = (await ghlFetch("/contacts/", {
    method: "POST",
    body: JSON.stringify(body),
  })) as { contact?: { id?: string } } | null;

  if (!result) return { ok: false as const, skipped: false as const, id: null };
  return { ok: true as const, skipped: false as const, id: result.contact?.id ?? null };
}
