import type { ReactNode } from "react";
import { buildOrderUrl } from "@/lib/order";
import { useOrderFlow } from "@/components/OrderFlow";

/**
 * Ordering CTA. Without a `locationSlug`, the click goes through the order
 * flow: saved location → direct, single enabled location → direct, otherwise
 * the "Which location?" picker. With a `locationSlug` (location cards), it
 * always goes straight to that location's ordering URL.
 */
export function OrderLink({
  content,
  className = "",
  children = "Order Now",
  ariaLabel,
  locationSlug,
  categorySlug,
}: {
  /** utm_content / cta_location value, e.g. "nav", "hero", "menu_card_crime-scene". */
  content: string;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
  /** Bypass the picker — the customer already chose the location. */
  locationSlug?: string;
  /** POS category deep link, e.g. "gotham-burgers". */
  categorySlug?: string | null;
}) {
  const flow = useOrderFlow();
  const loc = locationSlug ? flow.locations.find((l) => l.slug === locationSlug) : undefined;
  const href = buildOrderUrl({
    content,
    base: loc?.orderUrl,
    categorySlug: categorySlug ?? null,
  });

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        if (locationSlug) flow.orderAt(locationSlug, content, categorySlug);
        else flow.order(content, categorySlug);
      }}
    >
      {children}
    </a>
  );
}
