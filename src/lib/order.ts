/** Single source of truth for online ordering. */
export const ORDER_URL = "https://ordergothamhalal.com";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Build the ordering URL with campaign tracking.
 * `content` identifies the CTA, e.g. "nav", "hero", "menu_card_crime-scene".
 */
export function orderUrl(content: string) {
  const params = new URLSearchParams({
    utm_source: "gothamhalal",
    utm_medium: "site",
    utm_campaign: "order",
    utm_content: content,
  });
  return `${ORDER_URL}?${params.toString()}`;
}

/** Format a raw price string/number as $00.00 */
export function formatPrice(price: string | number) {
  const n = typeof price === "number" ? price : Number.parseFloat(price);
  if (!Number.isFinite(n)) return `$${price}`;
  return `$${n.toFixed(2)}`;
}
