import type { ReactNode } from "react";
import { orderUrl } from "@/lib/order";
import { trackOrderClick } from "@/lib/analytics";

/**
 * Ordering CTA: same-tab navigation to the ordering site with UTM tracking
 * and a GA `order_click` event carrying the CTA location.
 */
export function OrderLink({
  content,
  className = "",
  children = "Order Now",
  ariaLabel,
}: {
  /** utm_content / cta_location value, e.g. "nav", "hero", "menu_card_crime-scene". */
  content: string;
  className?: string;
  children?: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={orderUrl(content)}
      aria-label={ariaLabel}
      className={className}
      onClick={() => trackOrderClick(content)}
    >
      {children}
    </a>
  );
}
