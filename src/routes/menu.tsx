import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { MENU_DISHES, MENU_SECTIONS, menuJsonLd } from "@/data/menu";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Gotham Halal Smash Burgers" },
      { name: "description", content: "Smash burgers, halal fried chicken, wraps, bowls and loaded fries from Gotham Halal." },
      { property: "og:title", content: "Menu — Gotham Halal" },
      { property: "og:description", content: "Smash burgers, halal fried chicken, wraps and loaded fries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(menuJsonLd),
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Signature"
        title="Menu"
        blurb="The full Gotham Halal lineup lands here next — burgers, chicken, wraps, bowls, fries and dirty sodas."
      />
      <section className="bg-ink px-6 pb-24">
        <div className="mx-auto max-w-4xl space-y-14">
          {MENU_SECTIONS.map((section) => (
            <div key={section}>
              <h2 className="font-display text-2xl uppercase tracking-tight text-gold">{section}</h2>
              <ul className="mt-6 divide-y divide-gold/20 border-t border-gold/20">
                {MENU_DISHES.filter((d) => d.section === section).map((dish) => (
                  <li key={dish.name} className="py-5">
                    <h3 className="font-display text-lg uppercase tracking-tight text-background">{dish.name}</h3>
                    <p className="mt-1 text-sm text-background/70">{dish.copy}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

