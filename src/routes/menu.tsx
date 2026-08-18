import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MENU_DISHES, MENU_SECTIONS, MENU_SPECIALS, BURGER_ADD_ONS, menuJsonLd, type MenuDish } from "@/data/menu";
import { assertMenuSource } from "@/data/menu.check";
import menuBanner from "@/assets/gotham-menu-banner.png.asset.json";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

assertMenuSource();

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Gotham Halal Smash Burgers" },
      { name: "description", content: "Halal smash burgers, Gotham fries, healthy options and dirty sodas made fresh daily at Gotham Halal in Rochester." },
      { property: "og:title", content: "Menu — Gotham Halal" },
      { property: "og:description", content: "Smash burgers, Gotham fries and dirty sodas — 100% halal, made fresh daily." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/menu" },
    ],
    links: [{ rel: "canonical", href: "/menu" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(menuJsonLd) }],
  }),
  component: MenuPage,
});

function ingredientsFor(dish: MenuDish): string[] {
  if (dish.ingredients?.length) return dish.ingredients;
  return dish.copy
    .replace(/\.$/, "")
    .split(/,| \+ /)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

function addOnsFor(dish: MenuDish): string[] {
  if (dish.addOns?.length) return dish.addOns;
  if (dish.section === "Gotham Burgers") {
    const base = dish.name.replace(/^The Gotham /, "").replace(/^The /, "");
    const combo = MENU_DISHES.find((d) => d.section === "Burger Combos" && d.name.includes(base.split(" ")[0]));
    const withFries = MENU_DISHES.find((d) => d.section === "Burgers with Fries" && d.name.includes(base.split(" ")[0]));
    return [
      combo ? `${combo.name} — $${combo.price}` : BURGER_ADD_ONS[0],
      withFries ? `${withFries.name} — $${withFries.price}` : BURGER_ADD_ONS[1],
      ...BURGER_ADD_ONS.slice(2),
    ];
  }
  if (dish.section === "Gotham Fries") return ["Add melted cheese", "Add jalapeños", "Extra Gotham Sauce"];
  if (dish.section === "Gotham Dirty Sodas") return ["Extra cream top", "Add extra flavor shot"];
  return ["Add Gotham Regular Fries", "Add a Dirty Soda"];
}

function DetailBody({ dish }: { dish: MenuDish }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="display text-[11px] tracking-[0.2em] text-gold">INGREDIENTS</h4>
        <ul className="mt-2 flex flex-wrap gap-2">
          {ingredientsFor(dish).map((i) => (
            <li key={i} className="rounded-full border border-gold/30 px-3 py-1 text-xs text-cream/90">
              {i}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="display text-[11px] tracking-[0.2em] text-gold">COMBOS &amp; ADD-ONS</h4>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
          {addOnsFor(dish).map((a) => (
            <li key={a}>• {a}</li>
          ))}
        </ul>
      </div>
      <p className="display text-[11px] tracking-[0.16em] text-gold/70">
        {dish.section.toUpperCase()} · 100% HALAL
      </p>
    </div>
  );
}

function MenuPage() {
  const isMobile = useIsMobile();
  const [tab, setTab] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<MenuDish | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = MENU_DISHES.filter(
    (d) =>
      (tab === "All" || d.section === tab) &&
      (q === "" || d.name.toLowerCase().includes(q) || d.copy.toLowerCase().includes(q)),
  );
  const visibleSections = MENU_SECTIONS.filter((s) => filtered.some((d) => d.section === s));

  return (
    <>
      <h1 className="sr-only">Gotham Halal Menu</h1>
      <section
        aria-label="Menu"
        className="w-full bg-ink bg-cover bg-center"
        style={{ backgroundImage: `url(${menuBanner.url})`, aspectRatio: "1920 / 178" }}
      />

      <section className="bg-ink px-6 pb-24 pt-10">
        <div className="mx-auto max-w-6xl">
          {/* Filters */}
          <div className="flex flex-col gap-4 border-b border-gold/20 pb-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the menu…"
              aria-label="Search menu items"
              className="order-1 h-11 w-full min-w-0 border-gold/40 bg-ink text-cream placeholder:text-muted-foreground lg:order-2 lg:h-10 lg:w-64 lg:shrink-0"
            />
            <div
              role="tablist"
              aria-label="Menu categories"
              className="order-2 -mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:order-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0"
            >
              {["All", ...MENU_SECTIONS].map((section) => (
                <button
                  key={section}
                  type="button"
                  role="tab"
                  onClick={() => setTab(section)}
                  aria-selected={tab === section}
                  className={`display h-9 shrink-0 snap-start whitespace-nowrap rounded-full border px-4 text-[11px] tracking-[0.14em] transition ${
                    tab === section
                      ? "border-gold bg-gold text-ink"
                      : "border-gold/40 text-gold hover:border-gold hover:bg-gold/10"
                  }`}
                >
                  {section.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          {visibleSections.length === 0 ? (
            <p className="py-20 text-center text-sm text-muted-foreground">
              No items match “{query}”.
            </p>
          ) : (
            <div className="mt-12 space-y-14">
              {visibleSections.map((section) => (
                <div key={section}>
                  <div className="flex items-center justify-center gap-3 rounded-md border border-gold/60 px-5 py-2.5">
                    <span className="text-gold/70">★</span>
                    <h2 className="display text-center text-base tracking-[0.14em] text-gold sm:text-lg">
                      {section.toUpperCase()}
                    </h2>
                    <span className="text-gold/70">★</span>
                  </div>
                  <ul className="mt-6 grid gap-x-10 gap-y-0 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered
                      .filter((d) => d.section === section)
                      .map((dish) => (
                        <li key={dish.name} className="border-b border-gold/15">
                          <button
                            type="button"
                            onClick={() => setSelected(dish)}
                            className="group flex w-full items-start gap-4 py-4 text-left"
                          >
                            <div className="min-w-0 flex-1">
                              <h3 className="display text-sm tracking-[0.06em] text-cream transition group-hover:text-gold sm:text-base">
                                {dish.name}
                              </h3>
                              <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{dish.copy}</p>
                              <span className="display mt-2 inline-block text-[10px] tracking-[0.18em] text-gold/70 group-hover:text-gold">
                                VIEW DETAILS
                              </span>
                            </div>
                            <span className="display shrink-0 text-sm text-gold sm:text-base">{dish.price}</span>
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Promo band */}
          <div className="mt-16 rounded-xl border border-gold/40 p-8">
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

          <p className="display mt-10 text-center text-sm tracking-[0.14em] text-gold">{MENU_SPECIALS}</p>
        </div>
      </section>

      {isMobile ? (
        <Drawer open={selected !== null} onOpenChange={(open: boolean) => !open && setSelected(null)}>
          <DrawerContent className="max-h-[88vh] border-gold/40 bg-ink text-cream">
            {selected && (
              <>
                <DrawerHeader className="px-5 pb-2 text-left">
                  <DrawerTitle className="display text-left text-lg text-cream">{selected.name}</DrawerTitle>
                  <DrawerDescription className="text-left text-sm text-muted-foreground">
                    {selected.copy}
                  </DrawerDescription>
                </DrawerHeader>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
                  <DetailBody dish={selected} />
                </div>

                <div className="sticky bottom-0 border-t border-gold/25 bg-ink/95 px-5 pb-[env(safe-area-inset-bottom)] pt-3 backdrop-blur">
                  <div className="flex items-center justify-between gap-4 pb-3">
                    <span className="display text-lg text-gold">${selected.price}</span>
                    <a
                      href="https://ordergothamhalal.com"
                      className="display inline-flex h-11 flex-1 items-center justify-center rounded-full bg-gold px-6 text-xs tracking-[0.16em] text-ink"
                    >
                      ORDER NOW
                    </a>
                  </div>
                </div>
              </>
            )}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={selected !== null} onOpenChange={(open: boolean) => !open && setSelected(null)}>
          <DialogContent className="flex max-h-[85vh] flex-col gap-0 border-gold/40 bg-ink p-0 text-cream sm:max-w-lg">
            {selected && (
              <>
                <DialogHeader className="px-6 pt-6">
                  <DialogTitle className="display flex items-start justify-between gap-6 text-left text-lg text-cream">
                    <span className="min-w-0">{selected.name}</span>
                    <span className="shrink-0 text-gold">${selected.price}</span>
                  </DialogTitle>
                  <DialogDescription className="text-left text-sm text-muted-foreground">
                    {selected.copy}
                  </DialogDescription>
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
                  <DetailBody dish={selected} />
                </div>

                <div className="sticky bottom-0 flex items-center justify-between gap-4 border-t border-gold/25 bg-ink/95 px-6 py-4 backdrop-blur">
                  <span className="display text-[11px] tracking-[0.16em] text-gold/70">
                    {selected.section.toUpperCase()} · 100% HALAL
                  </span>
                  <a
                    href="https://ordergothamhalal.com"
                    className="display inline-flex h-10 items-center rounded-full bg-gold px-6 text-xs tracking-[0.16em] text-ink"
                  >
                    ORDER NOW
                  </a>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      )}

    </>
  );
}
