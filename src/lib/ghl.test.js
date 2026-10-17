import { expect, test } from "bun:test";
import { upsertGhlContact } from "./ghl.server";

test("GHL lookup uses its supported parameters and updates the matching contact", async () => {
  const originalFetch = globalThis.fetch;
  const originalToken = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
  const originalLocation = process.env.GHL_LOCATION_ID;
  process.env.GHL_PRIVATE_INTEGRATION_TOKEN = "test-token";
  process.env.GHL_LOCATION_ID = "test-location";
  const calls = [];
  globalThis.fetch = async (input, init) => {
    const url = new URL(String(input));
    calls.push({ url, method: init?.method });
    if (url.search) {
      expect(url.searchParams.get("locationId")).toBe("test-location");
      expect(url.searchParams.get("query")).toBe("form-test@example.com");
      expect(url.searchParams.has("location_id")).toBe(false);
      return Response.json({ contacts: [{ id: "test-contact" }] });
    }
    return Response.json({ contact: { id: "test-contact", tags: [] } });
  };
  try {
    const result = await upsertGhlContact({ email: "form-test@example.com", phone: "2025550111", tags: ["Catering Lead"] });
    expect(result.ok).toBe(true);
    expect(calls.at(-1)?.method).toBe("PUT");
    expect(calls.at(-1)?.url.pathname).toBe("/contacts/test-contact");
  } finally {
    globalThis.fetch = originalFetch;
    if (originalToken === undefined) delete process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
    else process.env.GHL_PRIVATE_INTEGRATION_TOKEN = originalToken;
    if (originalLocation === undefined) delete process.env.GHL_LOCATION_ID;
    else process.env.GHL_LOCATION_ID = originalLocation;
  }
});