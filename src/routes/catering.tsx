import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/catering")({
  head: () => ({
    meta: [
      { title: "Catering — Gotham Halal" },
      { name: "description", content: "Halal catering for office lunches, parties and events in Rochester, NY." },
      { property: "og:title", content: "Catering — Gotham Halal" },
      { property: "og:description", content: "Halal catering trays for office lunches, parties and events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/catering" },
    ],
    links: [{ rel: "canonical", href: "/catering" }],
  }),
  component: CateringPage,
});

function CateringPage() {
  return (
    <PageHeader
      eyebrow="Feed the crew"
      title="Catering That Hits Different"
      blurb="From office lunches to events, we've got you covered. Full catering packages coming soon."
    />
  );
}
