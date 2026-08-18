import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Gotham Halal Smash Burgers" },
      { name: "description", content: "Smash burgers, halal fried chicken, wraps, bowls and loaded fries from Gotham Halal." },
      { property: "og:title", content: "Menu — Gotham Halal" },
      { property: "og:description", content: "Smash burgers, halal fried chicken, wraps and loaded fries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <PageHeader
      eyebrow="Our Signature"
      title="Menu"
      blurb="The full Gotham Halal lineup lands here next — burgers, chicken, wraps, bowls, fries and dirty sodas."
    />
  );
}
