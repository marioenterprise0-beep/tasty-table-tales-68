import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/media")({
  component: MediaPage,
});

function MediaPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Media</h1>
    </section>
  );
}
