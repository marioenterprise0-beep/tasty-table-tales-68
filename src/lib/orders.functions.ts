import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { ORDER_ITEMS, placeOrderSchema, unitPriceFor } from "./orders.schemas";

const ORDER_NUMBER_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeOrderNumber() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let suffix = "";
  for (const b of bytes) suffix += ORDER_NUMBER_ALPHABET[b % ORDER_NUMBER_ALPHABET.length];
  return `GH-${suffix}`;
}

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { LOCATIONS } = await import("@/data/locations");

    const location = LOCATIONS.find(
      (l) => l.slug === data.locationSlug && l.status === "open",
    );
    if (!location) throw new Error("That pickup location isn't taking orders right now.");

    const ip =
      (getRequestHeader("x-forwarded-for") ?? "").split(",")[0]?.trim() ||
      getRequestHeader("cf-connecting-ip") ||
      null;
    const userAgent = getRequestHeader("user-agent") ?? null;

    // Anti-abuse: max 5 orders per phone per hour, 15 per IP per hour.
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const [phoneCount, ipCount] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("customer_phone", data.customerPhone)
        .gte("created_at", since),
      ip
        ? supabaseAdmin
            .from("orders")
            .select("id", { count: "exact", head: true })
            .eq("ip_address", ip)
            .gte("created_at", since)
        : Promise.resolve({ count: 0 }),
    ]);
    if ((phoneCount.count ?? 0) >= 5 || (ipCount.count ?? 0) >= 15) {
      throw new Error(
        "Too many orders in the last hour. Please call the store to place your order.",
      );
    }

    // Price is always computed server-side — never trust the client total.
    const unit = unitPriceFor(data.item, data.combo);
    const total = unit * data.quantity;

    let orderNumber = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      orderNumber = makeOrderNumber();
      const { error } = await supabaseAdmin.from("orders").insert({
        order_number: orderNumber,
        item: data.item,
        combo: data.combo,
        quantity: data.quantity,
        unit_price: unit,
        total,
        location_slug: location.slug,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        notes: data.notes || null,
        ip_address: ip,
        user_agent: userAgent,
      });
      if (!error) break;
      // Unique-collision on order_number → retry; anything else → fail.
      if (!error.message.includes("orders_order_number_key") || attempt === 2) {
        console.error("order insert failed", error.message);
        throw new Error("We couldn't place your order. Please try again.");
      }
    }

    const itemName = ORDER_ITEMS[data.item].name;
    const { notifyLead } = await import("./notify.server");
    await notifyLead(`New pickup order ${orderNumber}`, [
      `Item: ${itemName}${data.combo ? " (combo)" : ""}`,
      `Quantity: ${data.quantity}`,
      `Total: $${total.toFixed(2)} (pay at pickup)`,
      `Location: ${location.name}`,
      `Name: ${data.customerName}`,
      `Phone: ${data.customerPhone}`,
      `Notes: ${data.notes || "—"}`,
    ]);

    return {
      ok: true as const,
      orderNumber,
      total,
      locationName: location.name,
      locationAddress: `${location.street}, ${location.city}, ${location.region} ${location.postalCode}`,
      locationPhone: location.phone,
    };
  });
