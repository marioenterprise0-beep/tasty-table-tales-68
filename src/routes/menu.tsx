import { createFileRoute } from "@tanstack/react-router";
import { MENU_DISHES, MENU_SPECIALS, menuJsonLd } from "@/data/menu";
import { assertMenuSource } from "@/data/menu.check";
import menuBanner from "@/assets/gotham-menu-banner.png.asset.json";

assertMenuSource();

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Gotham Halal Smash Burgers" },
      { name: "description", content: "Halal smash burgers, Gotham fries and dirty sodas made fresh daily at Gotham Halal in Rochester." },
      { property: "og:title", content: "Menu — Gotham Halal" },
      { property: "og:description", content: "Smash burgers, Gotham fries and dirty sodas — 100% halal, made fresh daily." },
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

function SectionPlaque({ label }: { label: string }) {
  return (
    <div className="relative mx-auto flex w-full items-center justify-center gap-3 rounded-md border border-gold/60 bg-ink px-5 py-2.5 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.6)]">
      <span className="text-gold/70">★</span>
      <h2 className="display text-center text-base tracking-[0.14em] text-gold sm:text-lg">{label}</h2>
      <span className="text-gold/70">★</span>
    </div>
  );
}

function MenuColumn({
  label,
  section,
  children,
}: {
  label: string;
  section: string;
  children?: React.ReactNode;
}) {
  const items = MENU_DISHES.filter((d) => d.section === section);
  return (
    <div className="min-w-0">
      <SectionPlaque label={label} />
      <ul className="mt-6 divide-y divide-gold/20">
        {items.map((dish) => (
          <li key={dish.name} className="flex items-start gap-4 py-4">
            <div className="min-w-0 flex-1">
              <h3 className="display text-sm tracking-[0.06em] text-cream sm:text-base">{dish.name}</h3>
              <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{dish.copy}</p>
            </div>
            <span className="display shrink-0 text-sm text-gold sm:text-base">{dish.price}</span>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
}

function CompactList({ label, section }: { label: string; section: string }) {
  const items = MENU_DISHES.filter((d) => d.section === section);
  return (
    <div className="mt-8">
      <h3 className="display text-xs tracking-[0.22em] text-gold/80">{label}</h3>
      <ul className="mt-3 divide-y divide-gold/15">
        {items.map((dish) => (
          <li key={dish.name} className="flex items-baseline justify-between gap-4 py-2.5">
            <span className="min-w-0 truncate text-[13px] text-cream/90">{dish.name}</span>
            <span className="display shrink-0 text-[13px] text-gold">{dish.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MenuPage() {
  return (
    <>
      <h1 className="sr-only">Gotham Halal Menu</h1>
      <section
        aria-label="Menu"
        className="w-full bg-ink bg-cover bg-center"
        style={{ backgroundImage: `url(${menuBanner.url})`, aspectRatio: "1920 / 178" }}
      />

      <section className="bg-ink px-6 pb-24 pt-14">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-3 lg:gap-10">
          <MenuColumn label="GOTHAM BURGERS" section="Gotham Burgers">
            <CompactList label="COMBOS" section="Burger Combos" />
            <CompactList label="BURGERS + FRIES" section="Burgers with Fries" />
          </MenuColumn>
          <MenuColumn label="GOTHAM FRIES" section="Gotham Fries" />
          <MenuColumn label="GOTHAM DIRTY SODAS" section="Gotham Dirty Sodas" />
        </div>

        <div className="mx-auto mt-16 max-w-6xl rounded-xl border border-gold/40 p-8">
          <div className="grid gap-8 md:grid-cols-2 md:divide-x md:divide-gold/25">
            <div className="md:pr-8">
              <h2 className="display text-lg text-gold">GET THE GOTHAM HALAL APP</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Order ahead, skip the line, earn rewards every time you eat with us.
              </p>
            </div>
            <div className="md:pl-8">
              <h2 className="display text-lg text-gold">CATERING THAT HITS DIFFERENT</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                From office lunches to events, we've got you covered.
              </p>
              <a
                href="/contact"
                className="display mt-4 inline-flex h-10 items-center rounded-full border border-gold px-6 text-xs tracking-[0.16em] text-gold transition hover:bg-gold hover:text-ink"
              >
                CATER WITH US
              </a>
            </div>
          </div>
        </div>

        <p className="display mx-auto mt-10 max-w-6xl text-center text-sm tracking-[0.14em] text-gold">
          {MENU_SPECIALS}
        </p>
      </section>
    </>
  );
}
