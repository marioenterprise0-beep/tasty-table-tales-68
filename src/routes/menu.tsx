import { createFileRoute } from "@tanstack/react-router";
import { MediaSlot } from "@/components/MediaSlot";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Gotham Halal" },
      { name: "description", content: "The full Gotham Halal menu: signature smashed burgers, combos, loaded fries and dirty sodas — all 100% halal." },
      { property: "og:title", content: "Menu — Gotham Halal" },
      { property: "og:description", content: "Signature smashed burgers, loaded fries and dirty sodas." },
    ],
  }),
  component: MenuPage,
});

type Item = { name: string; desc?: string; price: string; tag?: "SPICY" | "VEG" };

const BURGERS: Item[] = [
  { name: "The Gotham Single Smash", desc: "Single smash patty, American cheese, Gotham Sauce.", price: "10" },
  { name: "The Gotham Double Smash", desc: "Double smash patties, American cheese, Gotham Sauce.", price: "12" },
  { name: "The Gotham Triple Smash", desc: "Triple smash patties, American cheese, Gotham Sauce.", price: "15" },
  { name: "The Gotham Heatwave", desc: "Double smash, pepperjack, jalapeños — a spicy kick.", price: "13", tag: "SPICY" },
  { name: "The Gotham Red Moon", desc: "Double smash with Hot Cheetos crunch and jalapeños.", price: "13", tag: "SPICY" },
];

const COMBOS: Item[] = [
  { name: "Single Smash Combo", desc: "Burger + Regular Fries + Dirty Soda.", price: "18" },
  { name: "Double Smash Combo", desc: "Burger + Regular Fries + Dirty Soda.", price: "20" },
  { name: "Triple Smash Combo", desc: "Burger + Regular Fries + Dirty Soda.", price: "23" },
  { name: "Heatwave Combo", desc: "Spicy burger + Regular Fries + Dirty Soda.", price: "21", tag: "SPICY" },
  { name: "Red Moon Combo", desc: "Spicy burger + Regular Fries + Dirty Soda.", price: "21", tag: "SPICY" },
];

const FRIES: Item[] = [
  { name: "Gotham Regular Fries", desc: "Golden fries tossed with Gotham Sauce.", price: "6" },
  { name: "Gotham Large Fries", desc: "The full portion, tossed and loud.", price: "10" },
  { name: "Signal Cheese Fries", desc: "Melted cheese with a drizzle of Gotham Sauce.", price: "8" },
  { name: "Crime Scene", desc: "Cheese fries, seasoned beef, beef bacon, jalapeños.", price: "13" },
  { name: "Smashafel", desc: "Crispy smashed falafel, lettuce, tomato, pickles, onions, Gotham Sauce.", price: "8", tag: "VEG" },
];

const SODAS: Item[] = [
  { name: "Strawberry Siren", desc: "Sweet strawberry, creamy finish.", price: "6" },
  { name: "Watermelon Phantom", desc: "Light watermelon, clean finish.", price: "6" },
  { name: "Peach District", desc: "Juicy peach, mellow finish.", price: "6" },
  { name: "Blue Nightfall", desc: "Cool blue citrus for Gotham nights.", price: "6" },
  { name: "Pineapple Pulse", desc: "Bright pineapple, tropical punch.", price: "6" },
  { name: "Mango Mirage", desc: "Tropical mango, silky sweet.", price: "6" },
  { name: "Green Voltage", desc: "Electric green apple with a bold bite.", price: "6" },
];

function MenuPage() {
  return (
    <>
      {/* HEADER */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-12 md:pt-20 pb-6">
        <div className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-foreground/80">The Full Lineup</div>
        <h1 className="mt-5 font-display text-[18vw] md:text-[12rem] leading-[0.88]">The Menu.</h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/85">
          Everything on the board. 100% halal, smashed to order, priced simple. Tap a category to jump in.
        </p>

        <div className="mt-10 flex flex-wrap gap-2">
          {[
            { id: "burgers", label: "Burgers" },
            { id: "combos", label: "Combos" },
            { id: "fries", label: "Fries" },
            { id: "sodas", label: "Sodas" },
          ].map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="rounded-full bg-nav text-nav-foreground px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] hover:brightness-110 transition"
            >
              {c.label}
            </a>
          ))}
        </div>
      </section>

      <MenuSection id="burgers" title="Gotham Burgers" caption="Fresh halal beef, lace-edge smashed, Gotham Sauce.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BURGERS.map((b) => (
            <ItemCard key={b.name} item={b} icon="🍔" />
          ))}
        </div>
      </MenuSection>

      <MenuSection id="combos" title="Combos" caption="Burger + Regular Fries + Dirty Soda.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMBOS.map((c) => (
            <RowItem key={c.name} item={c} />
          ))}
        </div>
      </MenuSection>

      <MenuSection id="fries" title="Loaded Fries" caption="Cheese, crunch, sauce. Built for sharing.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FRIES.map((f) => (
            <ItemCard key={f.name} item={f} icon="🍟" />
          ))}
        </div>
      </MenuSection>

      <MenuSection id="sodas" title="Dirty Sodas" caption="Seven house sodas. All $6, all cold.">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SODAS.map((s, i) => (
            <article key={s.name} className="rounded-[1.75rem] bg-nav text-nav-foreground p-6">
              <div className="font-display text-4xl text-primary-foreground/30 leading-none">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h4 className="mt-3 font-display text-2xl text-primary-foreground leading-tight">{s.name}</h4>
              <p className="mt-2 text-xs text-nav-foreground/75 leading-relaxed">{s.desc}</p>
              <div className="mt-4 pt-3 border-t border-nav-foreground/10 flex justify-between text-[11px] font-black uppercase tracking-[0.25em] text-primary-foreground">
                <span>Dirty Soda</span>
                <span>$6</span>
              </div>
            </article>
          ))}
        </div>
      </MenuSection>
    </>
  );
}

function MenuSection({ id, title, caption, children }: { id: string; title: string; caption: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-5 md:px-8 py-14 md:py-20 scroll-mt-24">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="font-display text-6xl md:text-8xl">{title}</h2>
          <p className="mt-3 text-foreground/75 max-w-xl">{caption}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function ItemCard({ item, icon }: { item: Item; icon: string }) {
  return (
    <article className="rounded-[1.75rem] bg-nav text-nav-foreground p-6">
      <div className="mb-5">
        <MediaSlot label={item.name} ratio="square" icon={icon} tone="dark" />
      </div>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-2xl md:text-3xl text-primary-foreground leading-tight">{item.name}</h3>
        <div className="font-display text-2xl text-primary-foreground shrink-0">${item.price}</div>
      </div>
      {item.desc && <p className="mt-3 text-sm text-nav-foreground/75 leading-relaxed">{item.desc}</p>}
      {item.tag && (
        <span className="mt-4 inline-block rounded-full bg-primary-foreground text-primary px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em]">
          {item.tag}
        </span>
      )}
    </article>
  );
}

function RowItem({ item }: { item: Item }) {
  return (
    <article className="rounded-2xl border-2 border-foreground/20 bg-background/60 p-6 flex items-start justify-between gap-6">
      <div>
        <h4 className="font-display text-2xl">{item.name}</h4>
        {item.desc && <p className="mt-1 text-sm text-foreground/75">{item.desc}</p>}
        {item.tag && (
          <span className="mt-3 inline-block rounded-full bg-nav text-nav-foreground px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.25em]">
            {item.tag}
          </span>
        )}
      </div>
      <div className="font-display text-3xl shrink-0">${item.price}</div>
    </article>
  );
}
