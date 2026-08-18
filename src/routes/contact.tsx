import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Gotham Halal" },
      { name: "description", content: "Questions, feedback or catering inquiries? Get in touch with the Gotham Halal team." },
      { property: "og:title", content: "Contact — Gotham Halal" },
      { property: "og:description", content: "Get in touch with the Gotham Halal team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageHeader
      eyebrow="Say hello"
      title="Contact"
      blurb="Questions, feedback or catering inquiries — reach out and we'll get back to you."
    />
  );
}
