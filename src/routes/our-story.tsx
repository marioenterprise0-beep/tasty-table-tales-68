import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Gotham Halal" },
      { name: "description", content: "Rochester born, community driven. The story behind Gotham Halal's hand-zabihah smash burgers." },
      { property: "og:title", content: "Our Story — Gotham Halal" },
      { property: "og:description", content: "Rochester born, community driven halal smash burgers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/our-story" },
    ],
    links: [{ rel: "canonical", href: "/our-story" }],
  }),
  component: StoryPage,
});

function StoryPage() {
  return (
    <PageHeader
      eyebrow="Bold food. Real values."
      title="Our Story"
      blurb="Rochester born. Community driven. Hand-zabihah halal, always. The full story goes here."
    />
  );
}
