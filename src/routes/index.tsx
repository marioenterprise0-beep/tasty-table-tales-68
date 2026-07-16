import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-semibold">Home</h1>
      <p className="mt-2 text-muted-foreground">Blank template. Ready to build.</p>
    </section>
  );
}
