import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/locations")({
  component: LocationsPage,
});

function LocationsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Locations</h1>
    </section>
  );
}
