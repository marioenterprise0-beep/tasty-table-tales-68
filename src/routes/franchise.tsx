import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/franchise")({
  head: () => ({
    meta: [
      { title: "Franchise — Own a Gotham Halal" },
      { name: "description", content: "Bring Gotham Halal's bold halal smash burgers to your city. Franchise opportunities and next steps." },
      { property: "og:title", content: "Franchise — Gotham Halal" },
      { property: "og:description", content: "Franchise opportunities with Gotham Halal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FranchisePage,
});

function FranchisePage() {
  return (
    <PageHeader
      eyebrow="Build with us"
      title="Franchise"
      blurb="Bring bold halal flavor to your city. Franchise details and application coming soon."
    />
  );
}
