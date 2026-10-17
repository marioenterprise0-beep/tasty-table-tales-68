import { createFileRoute, redirect } from "@tanstack/react-router";
import { buildOrderUrl } from "@/lib/order";

/** Preserve existing bookmarks without accepting orders outside the POS. */
export const Route = createFileRoute("/order")({
  beforeLoad: () => {
    throw redirect({ href: buildOrderUrl({ content: "legacy_order_page" }), statusCode: 302 });
  },
  head: () => ({
    meta: [
      { title: "Order Online — Gotham Halal" },
      { name: "description", content: "Order Gotham Halal through our official online ordering website." },
      { property: "og:title", content: "Order Online — Gotham Halal" },
      { property: "og:description", content: "Order Rochester's Gotham Halal smash burgers online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
