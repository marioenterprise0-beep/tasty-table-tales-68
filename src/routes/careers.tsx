import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Join the Gotham Halal Crew" },
      { name: "description", content: "Join the Gotham Halal team in Rochester, NY. Kitchen, counter and management roles." },
      { property: "og:title", content: "Careers — Gotham Halal" },
      { property: "og:description", content: "Join the Gotham Halal crew in Rochester, NY." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <PageHeader
      eyebrow="Join the crew"
      title="Careers"
      blurb="We hire for hustle and heart. Open roles and applications land here next."
    />
  );
}
