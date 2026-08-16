import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — Gotham Halal" },
      { name: "description", content: "Rochester born, community driven. The story behind Gotham Halal's hand-zabihah smash burgers." },
      { property: "og:title", content: "Our Story — Gotham Halal" },
      { property: "og:description", content: "Rochester born, community driven halal smash burgers." },
    ],
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
