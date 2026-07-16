import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/menu")({
  component: MenuPage,
});

function MenuPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Menu</h1>
    </section>
  );
}
