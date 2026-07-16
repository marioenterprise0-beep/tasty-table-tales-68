import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/franchise")({
  component: FranchisePage,
});

function FranchisePage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Franchise</h1>
    </section>
  );
}
