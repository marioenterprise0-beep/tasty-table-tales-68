import { createFileRoute } from "@tanstack/react-router";
import logoAsset from "@/assets/gotham-logo.png.asset.json";
import { MediaSlot } from "@/components/MediaSlot";

export const Route = createFileRoute("/")({
  component: Index,
});

const ORDER_URL = "https://ordergothamhalal.com";

const NAV = [
  { label: "Menu", href: "#menu" },
  { label: "Combos", href: "#combos" },
  { label: "Sodas", href: "#sodas" },
  { label: "Visit", href: "#visit" },
];

type Burger = { name: string; desc: string; price: string; tag?: "SPICY" };
const BURGERS: Burger[] = [
  { name: "The Gotham Single Smash", desc: "Single smash patty, American cheese, Gotham Sauce.", price: "10" },
  { name: "The Gotham Double Smash", desc: "Double smash patties, American cheese, Gotham Sauce.", price: "12" },
  { name: "The Gotham Triple Smash", desc: "Triple smash patties, American cheese, Gotham Sauce.", price: "15" },
  { name: "The Gotham Heatwave", desc: "Double smash, pepperjack, jalapeños — a spicy kick.", price: "13", tag: "SPICY" },
  { name: "The Gotham Red Moon", desc: "Double smash with Hot Cheetos crunch and jalapeños.", price: "13", tag: "SPICY" },
];

const COMBOS = [
  { name: "Single Smash Combo", price: "18" },
  { name: "Double Smash Combo", price: "20" },
  { name: "Triple Smash Combo", price: "23" },
  { name: "Heatwave Combo", price: "21" },
  { name: "Red Moon Combo", price: "21" },
];

const WITH_FRIES = [
  { name: "Single Smash + Fries", price: "13" },
  { name: "Double Smash + Fries", price: "15" },
  { name: "Triple Smash + Fries", price: "18" },
  { name: "Heatwave + Fries", price: "16" },
  { name: "Red Moon + Fries", price: "16" },
];

const FRIES = [
  { name: "Gotham Regular Fries", desc: "Golden fries tossed with Gotham Sauce.", price: "6" },
  { name: "Gotham Large Fries", desc: "Golden fries tossed with Gotham Sauce.", price: "10" },
  { name: "Signal Cheese Fries", desc: "Melted cheese with a drizzle of Gotham Sauce.", price: "8" },
  { name: "Crime Scene", desc: "Cheese fries, seasoned beef, beef bacon, jalapeños.", price: "13" },
  { name: "Smashafel", desc: "Crispy smashed falafel, lettuce, tomato, pickles, onions, Gotham Sauce.", price: "8", tag: "VEG" as const },
];

const SODAS = [
  { name: "Strawberry Siren", desc: "Sweet strawberry, creamy finish." },
  { name: "Watermelon Phantom", desc: "Light watermelon, clean finish." },
  { name: "Peach District", desc: "Juicy peach, mellow finish." },
  { name: "Blue Nightfall", desc: "Cool blue citrus for Gotham nights." },
  { name: "Pineapple Pulse", desc: "Bright pineapple, bold tropical punch." },
  { name: "Mango Mirage", desc: "Tropical mango, rich silky sweetness." },
  { name: "Green Voltage", desc: "Electric green apple with a bold bite." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body overflow-x-hidden">
      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-primary/20 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 md:px-8 py-3">
          <a href="#top" className="flex items-center gap-3">
            <img src={logoAsset.url} alt="Gotham Halal" className="h-10 md:h-12 w-auto" />
          </a>
          <nav className="hidden md:flex items-center gap-9 text-xs font-bold uppercase tracking-[0.25em] text-foreground/85">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-primary transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm bg-primary px-5 md:px-6 py-2.5 md:py-3 text-[11px] md:text-xs font-black uppercase tracking-[0.25em] text-primary-foreground hover:brightness-110 transition"
          >
            Order Now
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative">
        {/* radial gold spotlight */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 75% 40%, rgba(212,163,60,0.22), transparent 70%), radial-gradient(80% 60% at 15% 90%, rgba(212,163,60,0.08), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8 pt-14 md:pt-24 pb-16 md:pb-28 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              <span className="h-px w-8 bg-primary/70" />
              100% Halal · Smashed to Order
            </div>
            <h1 className="mt-6 font-display text-[19vw] md:text-[10.5rem] text-foreground">
              Smashed<br/>in <span className="text-primary">Gotham.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-foreground/80">
              Halal smashed burgers, dirty sodas and loaded fries — served fast, served loud, built for Gotham nights.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={ORDER_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm bg-primary px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-primary-foreground hover:brightness-110 transition"
              >
                Order Online
              </a>
              <a
                href="#menu"
                className="rounded-sm border border-primary/60 px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-primary hover:bg-primary hover:text-primary-foreground transition"
              >
                See the Menu
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/60">
              <span>Halal Certified</span>
              <span>·</span>
              <span>Fresh Smashed</span>
              <span>·</span>
              <span>Gotham Sauce</span>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div
                aria-hidden
                className="absolute -inset-6 rounded-full opacity-70 blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(212,163,60,0.35), transparent 65%)" }}
              />
              <img
                src={logoAsset.url}
                alt="Gotham Halal logo"
                className="relative w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        </div>

        {/* Specials band */}
        <div className="relative bg-primary text-primary-foreground border-y border-primary">
          <div className="mx-auto max-w-7xl px-5 md:px-8 py-4 md:py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-center font-display text-2xl md:text-4xl tracking-wide">
            <span>5 Double Smash · $50</span>
            <span className="opacity-40">✦</span>
            <span>10 for $100</span>
            <span className="opacity-40">✦</span>
            <span>Halal · Smashed Daily</span>
          </div>
        </div>
      </section>

      {/* BURGERS */}
      <section id="menu" className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <SectionHeader eyebrow="The Menu" title="Gotham Burgers" />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BURGERS.map((b) => (
            <article
              key={b.name}
              className="group relative rounded-md border border-primary/25 bg-card p-6 hover:border-primary transition-colors"
            >
              <div className="mb-6">
                <MediaSlot label={b.name} ratio="square" icon="🍔" />
              </div>
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-2xl md:text-3xl text-foreground leading-tight">{b.name}</h3>
                <div className="font-display text-2xl text-primary shrink-0">${b.price}</div>
              </div>
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed">{b.desc}</p>
              {b.tag && (
                <span className="mt-4 inline-block rounded-sm bg-destructive/15 text-destructive px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em]">
                  {b.tag}
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* COMBOS */}
      <section id="combos" className="border-y border-primary/15 bg-card/40">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
          <SectionHeader eyebrow="Build the Meal" title="Combos & Sides" />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
            <PriceList
              title="Burger Combos"
              caption="Served with Gotham Regular Fries + your choice of Dirty Soda."
              rows={COMBOS}
            />
            <PriceList
              title="Burgers + Fries"
              caption="Just the burger and the fries. No soda."
              rows={WITH_FRIES}
            />
          </div>

          {/* Fries grid */}
          <div className="mt-16">
            <h3 className="font-display text-4xl md:text-5xl text-foreground">Gotham Fries</h3>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FRIES.map((f) => (
                <article
                  key={f.name}
                  className="rounded-md border border-primary/25 bg-card p-6"
                >
                  <div className="mb-5">
                    <MediaSlot label={f.name} ratio="wide" icon="🍟" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-display text-xl md:text-2xl text-foreground">{f.name}</h4>
                    <div className="font-display text-xl text-primary shrink-0">${f.price}</div>
                  </div>
                  <p className="mt-2 text-sm text-foreground/70">{f.desc}</p>
                  {"tag" in f && f.tag && (
                    <span className="mt-3 inline-block rounded-sm border border-primary/60 text-primary px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.25em]">
                      Vegetarian
                    </span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SODAS */}
      <section id="sodas" className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 0%, rgba(212,163,60,0.12), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
          <SectionHeader eyebrow="All $6" title="Gotham Dirty Sodas" />
          <p className="mt-4 max-w-xl text-foreground/70">
            Every soda in the lineup — sweet, cold, and made for Gotham nights.
          </p>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {SODAS.map((s, i) => (
              <article
                key={s.name}
                className="group relative overflow-hidden rounded-md border border-primary/25 bg-card p-5 hover:border-primary transition-colors"
              >
                <div className="font-display text-4xl text-primary/25 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h4 className="mt-4 font-display text-xl md:text-2xl text-foreground leading-tight">
                  {s.name}
                </h4>
                <p className="mt-2 text-xs text-foreground/70 leading-relaxed">{s.desc}</p>
                <div className="mt-5 flex items-center justify-between border-t border-primary/15 pt-3 text-[11px] font-black uppercase tracking-[0.25em] text-primary">
                  <span>Dirty Soda</span>
                  <span>$6</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="border-y border-primary/15 bg-card/40">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-20 md:py-28 text-center">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Our Story</div>
          <h2 className="mt-5 font-display text-5xl md:text-7xl text-foreground">
            Halal, done <span className="text-primary">Gotham</span> style.
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-foreground/80 leading-relaxed">
            Gotham Halal is a smash-burger joint built for the ones who want it loud, juicy, and honest.
            100% halal beef, crispy lace-edge patties, buttery toasted buns, and a Gotham Sauce we make
            in-house. No shortcuts. No apologies. Just a serious burger — smashed and served the same way,
            every time.
          </p>
        </div>
      </section>

      {/* VISIT / ORDER */}
      <section id="visit" className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-md bg-primary text-primary-foreground p-10 md:p-12 flex flex-col">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] opacity-80">Skip the line</div>
            <h3 className="mt-4 font-display text-5xl md:text-6xl">Order Online</h3>
            <p className="mt-4 text-primary-foreground/85 max-w-sm">
              Pick your burger, pick your fries, pick your dirty soda. We'll have it hot and ready.
            </p>
            <a
              href={ORDER_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 self-start rounded-sm bg-primary-foreground text-primary px-7 py-4 text-xs font-black uppercase tracking-[0.25em] hover:brightness-95 transition"
            >
              ordergothamhalal.com →
            </a>
          </div>

          <div className="rounded-md border border-primary/30 p-10 md:p-12">
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Visit</div>
            <h3 className="mt-4 font-display text-5xl md:text-6xl text-foreground">Hours</h3>
            <ul className="mt-6 space-y-3 text-base font-medium text-foreground/85">
              <li className="flex justify-between border-b border-primary/10 pb-3"><span>Mon – Thu</span><span className="text-primary">11am – 10pm</span></li>
              <li className="flex justify-between border-b border-primary/10 pb-3"><span>Fri</span><span className="text-primary">11am – 11pm</span></li>
              <li className="flex justify-between border-b border-primary/10 pb-3"><span>Sat</span><span className="text-primary">12pm – 11pm</span></li>
              <li className="flex justify-between"><span>Sun</span><span className="text-primary">12pm – 9pm</span></li>
            </ul>
            <p className="mt-6 text-sm text-foreground/60">Location details coming soon.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-primary/20 bg-sidebar">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <img src={logoAsset.url} alt="Gotham Halal" className="h-16 w-auto" />
            <p className="mt-4 text-sm text-sidebar-foreground/70 max-w-xs">
              Halal smashed burgers, dirty sodas and loaded fries. Built for Gotham nights.
            </p>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Order</div>
            <ul className="mt-3 space-y-1.5 text-sm text-sidebar-foreground/85">
              <li><a href={ORDER_URL} target="_blank" rel="noreferrer" className="hover:text-primary">ordergothamhalal.com</a></li>
              <li>Pickup available</li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Follow</div>
            <ul className="mt-3 space-y-1.5 text-sm text-sidebar-foreground/85">
              <li>Instagram · @gothamhalal</li>
              <li>TikTok · @gothamhalal</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary/15">
          <div className="mx-auto max-w-7xl px-5 md:px-8 py-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-sidebar-foreground/60 flex flex-wrap justify-between gap-3">
            <span>© {new Date().getFullYear()} Gotham Halal</span>
            <span>100% Halal · Smashed Daily</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary">
        <span className="h-px w-8 bg-primary/70" />
        {eyebrow}
      </div>
      <h2 className="mt-4 font-display text-6xl md:text-8xl text-foreground">{title}</h2>
    </div>
  );
}

function PriceList({
  title,
  caption,
  rows,
}: {
  title: string;
  caption: string;
  rows: { name: string; price: string }[];
}) {
  return (
    <div className="rounded-md border border-primary/25 p-8 md:p-10 bg-background/60">
      <h3 className="font-display text-3xl md:text-4xl text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-foreground/60">{caption}</p>
      <ul className="mt-6 divide-y divide-primary/10">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center justify-between py-3.5">
            <span className="text-base font-medium text-foreground/90">{r.name}</span>
            <span className="font-display text-xl text-primary">${r.price}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
