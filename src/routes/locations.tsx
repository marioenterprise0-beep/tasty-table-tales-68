import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — Gotham Halal Rochester, NY" },
      { name: "description", content: "Find a Gotham Halal location near you in Rochester, NY. Hours, directions and ordering." },
      { property: "og:title", content: "Locations — Gotham Halal" },
      { property: "og:description", content: "Find a Gotham Halal location near you in Rochester, NY." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/locations" },
    ],
    links: [{ rel: "canonical", href: "/locations" }],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <PageHeader
      eyebrow="Find us"
      title="Locations"
      blurb="Rochester born and growing. Store addresses, hours and directions land here next."
    />
  );
}
