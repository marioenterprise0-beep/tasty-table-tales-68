/**
 * Google Analytics 4 (gtag.js) with cross-domain measurement between
 * the marketing site and the ordering domain.
 */
import { ORDER_URL } from "./order";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY"] as
  | string
  | undefined;

const ORDER_DOMAIN = new URL(ORDER_URL).hostname;

let initialized = false;

export function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(args);
}

export function initAnalytics() {
  if (typeof window === "undefined" || initialized || !MEASUREMENT_ID) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, {
    send_page_view: true,
    linker: { domains: [window.location.hostname, ORDER_DOMAIN] },
  });
}

export function trackPageView(path: string) {
  if (!MEASUREMENT_ID) return;
  gtag("event", "page_view", { page_path: path, page_location: window.location.href });
}

/** Fired on every ordering CTA. */
export function trackOrderClick(ctaLocation: string) {
  if (!MEASUREMENT_ID) return;
  gtag("event", "order_click", { cta_location: ctaLocation });
}
