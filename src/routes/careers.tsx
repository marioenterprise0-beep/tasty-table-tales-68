import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
});

function CareersPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Careers</h1>
    </section>
  );
}
