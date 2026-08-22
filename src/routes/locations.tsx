import { createFileRoute } from "@tanstack/react-router";
import { LocationCard, useNow } from "@/components/LocationsBlock";
import { DAY_LABELS, LOCATIONS, fullAddress, hoursLabel } from "@/data/locations";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — Gotham Halal Rochester, NY" },
      { name: "description", content: "Gotham Halal locations in Rochester, NY — West Ridge Road now open and Jefferson Road opening soon. Hours, directions and ordering." },
      { property: "og:title", content: "Locations — Gotham Halal" },
      { property: "og:description", content: "West Ridge Road is open and Jefferson Road is opening soon in Rochester, NY." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/locations" },
    ],
    links: [{ rel: "canonical", href: "/locations" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: LOCATIONS.map((l, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Restaurant",
              name: l.name,
              telephone: l.phone,
              servesCuisine: ["Halal", "Smash Burgers", "Loaded Fries"],
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: l.street,
                addressLocality: l.city,
                addressRegion: l.region,
                postalCode: l.postalCode,
                addressCountry: "US",
              },
            },
          })),
        }),
      },
    ],
  }),
  component: LocationsPage,
});

function LocationsPage() {
  const now = useNow();

  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-[1500px] px-5 py-12 md:px-10">
        <p className="display text-[11px] tracking-[0.24em] text-gold">Find us</p>
        <h1 className="display mt-3 text-[2.5rem] leading-[0.9] tracking-[-0.02em] text-white sm:text-[3.25rem]">
          Locations
        </h1>
        <p className="mt-4 max-w-lg text-[16px] leading-snug text-white/85">
          Rochester born and growing. Here&apos;s where to find us.
        </p>

        <div className="mt-9 grid gap-6 md:grid-cols-2">
          {LOCATIONS.map((l) => (
            <LocationCard key={l.slug} location={l} now={now} />
          ))}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {LOCATIONS.map((l) => (
            <div key={l.slug} className="rounded-2xl border border-gold/20 p-6">
              <h2 className="display text-[15px] tracking-[0.03em] text-gold">{l.shortName} Hours</h2>

              <dl className="mt-4 space-y-1.5">
                {l.hours.map((h, i) => (
                  <div key={DAY_LABELS[i]} className="flex justify-between gap-4 text-[13.5px]">
                    <dt className="text-white/70">{DAY_LABELS[i]}</dt>
                    <dd className="text-white/90">{hoursLabel(h)}</dd>
                  </div>
                ))}
              </dl>
              {l.status === "opening_soon" && (
                <p className="display mt-4 text-[10px] tracking-[0.16em] text-gold">
                  Hours start when we open
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
