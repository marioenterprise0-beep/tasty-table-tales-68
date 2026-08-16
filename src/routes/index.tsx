import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Leaf, Flame, Building2 } from "lucide-react";
import { MediaSlot } from "@/components/MediaSlot";
import { Skyline, BridgeWatermark } from "@/components/Skyline";

const ORDER_URL = "https://ordergothamhalal.com";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gotham Halal — Bold. Halal. Gotham." },
      {
        name: "description",
        content:
          "Halal smash burgers, fried chicken and wraps made fresh daily in Rochester, NY. Hand-zabihah halal, built for flavor.",
      },
      { property: "og:title", content: "Gotham Halal — Bold. Halal. Gotham." },
      {
        property: "og:description",
        content: "Halal smash burgers, fried chicken and wraps made fresh daily in Rochester, NY.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const VALUES = [
  { Icon: BadgeCheck, title: "100% Halal", copy: "Hand-zabihah halal meats. Always." },
  { Icon: Leaf, title: "Fresh Ingredients", copy: "Locally sourced. Cooked to order." },
  { Icon: Flame, title: "Bold Flavor", copy: "Big taste. No shortcuts. Ever." },
  { Icon: Building2, title: "ROC Roots", copy: "Rochester born. Community driven." },
];

const HIGHLIGHTS = [
  {
    name: "Gotham Single Smash",
    copy: "Single smash patty, American cheese, Gotham Sauce, pickles, onions, lettuce.",  },
  {
    name: "Heatwave Double Smash",
    copy: "Double smash patties, pepperjack cheese, spicy kick sauce, lettuce, jalapeños.",  },
  {
    name: "Red Moon Smash Burger",
    copy: "Double smash patties, Hot Cheetos crunch, jalapeños, Red Moon sauce, lettuce.",  },
  {
    name: "Crime Scene Fries",
    copy: "Fries topped with beef bacon, jalapeños, drizzled Gotham Sauce.",  },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-ink">
        <div className="grid lg:grid-cols-[1fr_1.15fr] min-h-[560px]">
          {/* Left black panel */}
          <div className="relative z-10 flex items-center px-6 md:px-12 lg:pl-16 py-16 lg:py-24">
            <div className="max-w-xl">
              <h1 className="display text-6xl sm:text-7xl md:text-8xl leading-[0.85]">
                <span className="block">Bold.</span>
                <span className="block">Halal.</span>
                <span className="block text-gold">Gotham.</span>
              </h1>
              <p className="mt-6 text-base md:text-lg text-nav-foreground/80 leading-relaxed max-w-md">
                Halal burgers, fried chicken &amp; sandwiches made fresh daily. Built for flavor.
                Made for you.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={ORDER_URL} target="_blank" rel="noreferrer" className="pill-gold px-8 py-3.5 text-xs">
                  Order Now
                </a>
                <Link to="/menu" className="pill-outline px-8 py-3.5 text-xs">
                  View Menu
                </Link>
              </div>
            </div>
          </div>

          {/* Right gold panel */}
          <div className="relative bg-gold overflow-hidden min-h-[340px] lg:min-h-0">
            {/* diagonal spatter edge */}
            <div
              className="hidden lg:block absolute inset-y-0 -left-24 w-40 bg-ink"
              style={{ clipPath: "polygon(0 0, 100% 0, 35% 100%, 0% 100%)" }}
              aria-hidden="true"
            />
            <BridgeWatermark className="absolute inset-0 w-full h-full text-gold-foreground/15 pointer-events-none" />
            <div className="relative h-full flex items-center justify-center p-8 lg:p-12">
              <MediaSlot
                ratio="wide"
                tone="gold"
                label="Hero photo — smash burger lineup"
                className="max-w-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* VALUE BAR */}
      <section className="bg-ink border-y border-gold/25">
        <div className="mx-auto max-w-[1500px] grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gold/25">
          {VALUES.map(({ Icon, title, copy }) => (
            <div key={title} className="flex items-start gap-4 px-8 py-8">
              <Icon className="w-9 h-9 shrink-0 text-gold" strokeWidth={1.5} />
              <div>
                <h3 className="display text-gold text-base tracking-[0.12em]">{title}</h3>
                <p className="mt-1 text-sm text-nav-foreground/75 leading-snug">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MENU HIGHLIGHTS */}
      <section className="bg-gold py-14 md:py-16">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">
          <div className="flex items-center gap-5 justify-center mb-10">
            <span className="hidden sm:block h-px flex-1 bg-gold-foreground/40" />
            <h2 className="display text-gold-foreground text-3xl md:text-4xl tracking-[0.06em] text-center">
              • Menu Highlights •
            </h2>
            <span className="hidden sm:block h-px flex-1 bg-gold-foreground/40" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <article
                key={item.name}
                className="rounded-2xl bg-ink border border-gold/30 overflow-hidden flex flex-col"
              >
                <div className="p-3 pb-0">
                  <MediaSlot ratio="card" icon={item.icon} label={item.name} />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="display text-gold text-xl leading-tight">{item.name}</h3>
                  <p className="mt-2 text-sm text-nav-foreground/75 leading-relaxed flex-1">
                    {item.copy}
                  </p>
                  <a
                    href={ORDER_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-outline mt-5 px-5 py-2.5 text-[10px] self-start"
                  >
                    Order Now
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* APP + CATERING */}
      <section className="bg-ink border-y border-gold/25">
        <div className="mx-auto max-w-[1500px] grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gold/25">
          <div className="flex items-center gap-8 px-8 md:px-12 py-12">
            <div className="hidden sm:block w-32 shrink-0">
              <MediaSlot ratio="phone" icon="📱" label="App screen" />
            </div>
            <div>
              <h2 className="display text-gold text-2xl md:text-3xl">Get the Gotham Halal App</h2>
              <p className="mt-2 text-sm text-nav-foreground/75 max-w-sm leading-relaxed">
                Order ahead, skip the line, earn rewards every time you eat with us.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {["App Store", "Google Play"].map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center rounded-lg border border-gold/40 px-4 py-2.5 text-xs text-nav-foreground/80"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8 px-8 md:px-12 py-12">
            <div>
              <h2 className="display text-gold text-2xl md:text-3xl">Catering That Hits Different</h2>
              <p className="mt-2 text-sm text-nav-foreground/75 max-w-sm leading-relaxed">
                From office lunches to events, we've got you covered.
              </p>
              <Link to="/catering" className="pill-outline mt-5 px-6 py-3 text-[11px]">
                Cater With Us
              </Link>
            </div>
            <div className="hidden md:block w-56 shrink-0">
              <MediaSlot ratio="card" icon="🥡" label="Catering trays" />
            </div>
          </div>
        </div>
      </section>

      {/* SKYLINE BAND */}
      <section className="relative bg-gold overflow-hidden">
        <Skyline className="absolute bottom-0 left-0 w-[60%] h-16 text-gold-foreground/25" />
        <div className="relative mx-auto max-w-[1500px] px-6 md:px-10 py-7 flex flex-col sm:flex-row items-center justify-center gap-5">
          <p className="display text-gold-foreground text-xl md:text-3xl text-center tracking-[0.04em]">
            Bold Food. Real Values. Rochester Proud.
          </p>
          <Link
            to="/our-story"
            className="sm:absolute sm:right-10 inline-flex items-center rounded-full border-[1.5px] border-gold-foreground px-6 py-2.5 display text-[11px] tracking-[0.16em] text-gold-foreground hover:bg-gold-foreground hover:text-gold transition"
          >
            Our Story
          </Link>
        </div>
      </section>
    </>
  );
}
