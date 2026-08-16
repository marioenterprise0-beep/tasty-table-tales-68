import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — Gotham Halal" },
      { name: "description", content: "Order ahead, skip the line and earn rewards every time you eat with Gotham Halal." },
      { property: "og:title", content: "Rewards — Gotham Halal" },
      { property: "og:description", content: "Order ahead, skip the line, earn rewards." },
    ],
  }),
  component: RewardsPage,
});

function RewardsPage() {
  return (
    <PageHeader
      eyebrow="Eat more, get more"
      title="Rewards"
      blurb="Order ahead, skip the line and earn points on every order. Program details coming soon."
    />
  );
}
