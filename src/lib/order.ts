/** Single source of truth for online ordering. */
export const ORDER_URL = "https://ordergothamhalal.com";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Build an ordering URL with campaign tracking.
 * `content` identifies the CTA, e.g. "nav", "hero", "menu_card_crime-scene".
 * `base` is the location's ordering URL; `categorySlug` deep-links into a
 * POS category (https://ordergothamhalal.com/order-now/[slug]).
 */
export function buildOrderUrl(opts: { content: string; base?: string; categorySlug?: string | null }) {
  const base = (opts.base || ORDER_URL).replace(/\/+$/, "");
  const path = opts.categorySlug ? `${base}/order-now/${opts.categorySlug}` : base;
  const params = new URLSearchParams({
    utm_source: "gothamhalal",
    utm_medium: "site",
    utm_campaign: "order",
    utm_content: opts.content,
  });
  return `${path}?${params.toString()}`;
}

export function orderUrl(content: string) {
  return buildOrderUrl({ content });
}

/** Format a raw price string/number as $00.00 */
export function formatPrice(price: string | number) {
  const n = typeof price === "number" ? price : Number.parseFloat(price);
  if (!Number.isFinite(n)) return `$${price}`;
  return `$${n.toFixed(2)}`;
}
