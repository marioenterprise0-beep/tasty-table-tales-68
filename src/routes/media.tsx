import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media & Press — Gotham Halal" },
      { name: "description", content: "Press mentions, brand assets and media inquiries for Gotham Halal in Rochester, NY." },
      { property: "og:title", content: "Media & Press — Gotham Halal" },
      { property: "og:description", content: "Press mentions and media inquiries for Gotham Halal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/media" },
    ],
    links: [{ rel: "canonical", href: "/media" }],
  }),
  component: MediaPage,
});

function MediaPage() {
  return (
    <PageHeader
      eyebrow="Press kit"
      title="Media"
      blurb="Press mentions, logos and brand assets. Media inquiries welcome."
    />
  );
}
