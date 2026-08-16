import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Leaf, Flame, Building2 } from "lucide-react";
import { MediaSlot } from "@/components/MediaSlot";
import { Skyline, BridgeWatermark, SpatterEdge } from "@/components/Skyline";

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
    copy: "Single smash patty, American cheese, Gotham Sauce, pickles, onions, lettuce.",
  },
  {
    name: "Heatwave Double Smash",
    copy: "Double smash patties, pepperjack cheese, spicy kick sauce, lettuce, jalapeños.",
  },
  {
    name: "Red Moon Smash Burger",
    copy: "Double smash patties, Hot Cheetos crunch, jalapeños, Red Moon sauce, lettuce.",
  },
  {
    name: "Crime Scene Fries",
    copy: "Fries topped with beef bacon, jalapeños, drizzled Gotham Sauce.",
  },
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative bg-ink overflow-hidden">
        <div className="grid lg:grid-cols-[44%_56%] min-h-[380px] lg:min-h-[460px]">
          {/* Left black panel */}
          <div className="relative z-20 flex items-center px-6 md:px-10 lg:pl-14 py-12 lg:py-0">
            <div className="max-w-[34rem]">
              <h1 className="display text-[3.25rem] sm:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] leading-[0.92] tracking-[-0.02em]">
                <span className="block">Bold.</span>
                <span className="block">Halal.</span>
                <span className="block text-gold">Gotham.</span>
              </h1>
              <p className="mt-5 text-sm md:text-[15px] text-nav-foreground/85 leading-snug max-w-sm">
                Halal burgers, fried chicken &amp; sandwiches
                <br className="hidden sm:block" /> made fresh daily. Built for flavor. Made for you.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={ORDER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="pill-gold px-7 py-2.5 text-[11px]"
                >
                  Order Now
                </a>
                <Link to="/menu" className="pill-outline px-7 py-2.5 text-[11px] border-nav-foreground text-nav-foreground hover:bg-nav-foreground hover:text-ink">
                  View Menu
                </Link>
              </div>
            </div>
          </div>

          {/* Right gold panel */}
          <div className="relative bg-gold min-h-[300px] lg:min-h-0">
            <BridgeWatermark className="absolute inset-x-0 bottom-0 top-[6%] w-full h-[94%] text-gold-foreground/20 pointer-events-none" />
            <Skyline className="absolute bottom-0 right-0 w-2/3 h-16 text-gold-foreground/15 pointer-events-none" />
            <div className="relative h-full flex items-end justify-center px-6 lg:px-10 pt-8">
              <MediaSlot
                fill
                tone="gold"
                label="Hero photo — smash burger lineup (transparent PNG)"
                className="border-0"
              />
            </div>
            {/* ragged ink edge into the gold panel */}
            <SpatterEdge className="hidden lg:block absolute inset-y-0 -left-[1px] h-full w-[110px] text-ink z-10 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* VALUE BAR */}
      <section className="bg-ink border-y-2 border-gold/40">
        <div className="mx-auto max-w-[1500px] grid sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gold/30">
          {VALUES.map(({ Icon, title, copy }) => (
            <div key={title} className="flex items-center gap-4 px-8 py-5">
              <Icon className="w-8 h-8 shrink-0 text-gold" strokeWidth={1.4} />
              <div>
                <h3 className="display text-gold text-[13px] tracking-[0.08em]">{title}</h3>
                <p className="mt-0.5 text-[13px] text-nav-foreground/80 leading-snug">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MENU HIGHLIGHTS */}
      <section className="bg-gold py-8 md:py-10">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="flex items-center gap-4 justify-center mb-6">
            <span className="h-px w-16 sm:w-40 bg-gold-foreground/50" />
            <h2 className="display text-gold-foreground text-2xl md:text-[28px] tracking-[0.02em] text-center whitespace-nowrap">
              • Menu Highlights •
            </h2>
            <span className="h-px w-16 sm:w-40 bg-gold-foreground/50" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <article
                key={item.name}
                className="rounded-xl bg-ink overflow-hidden flex flex-col shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)]"
              >
                <div className="aspect-[4/3] w-full">
                  <MediaSlot fill label={item.name} className="border-0" />
                </div>
                <div className="px-4 pb-5 pt-1 text-center">
                  <h3 className="display text-gold text-base md:text-lg leading-tight">
                    {item.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] text-nav-foreground/80 leading-snug">
                    {item.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* APP + CATERING */}
      <section className="bg-ink border-t-2 border-gold/40">
        <div className="mx-auto max-w-[1500px] grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gold/30">
          <div className="flex items-center gap-6 px-8 md:px-12 py-7">
            <div className="hidden sm:block w-20 shrink-0">
              <MediaSlot ratio="phone" label="App" />
            </div>
            <div>
              <h2 className="display text-gold text-xl md:text-2xl">Get the Gotham Halal App</h2>
              <p className="mt-1.5 text-[13px] text-nav-foreground/80 max-w-sm leading-snug">
                Order ahead, skip the line, earn rewards every time you eat with us.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {["App Store", "Google Play"].map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center rounded-md border border-gold/40 px-4 py-2 text-[11px] text-nav-foreground/85"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 px-8 md:px-12 py-7">
            <div>
              <h2 className="display text-gold text-xl md:text-2xl">Catering That Hits Different</h2>
              <p className="mt-1.5 text-[13px] text-nav-foreground/80 max-w-sm leading-snug">
                From office lunches to events, we've got you covered.
              </p>
              <Link to="/catering" className="pill-outline mt-4 px-6 py-2.5 text-[11px]">
                Cater With Us
              </Link>
            </div>
            <div className="hidden md:block w-52 shrink-0 ml-auto">
              <MediaSlot ratio="card" label="Catering trays" />
            </div>
          </div>
        </div>
      </section>

      {/* SKYLINE BAND */}
      <section className="relative bg-gold overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 w-[24%] bg-ink"
          style={{ clipPath: "polygon(0 0, 78% 0, 100% 100%, 0 100%)" }}
          aria-hidden="true"
        />
        <Skyline className="absolute bottom-0 left-0 w-[20%] h-full text-gold/70 z-10" />
        <div className="relative z-20 mx-auto max-w-[1500px] pl-[26%] pr-6 md:pr-52 py-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="display text-gold-foreground text-lg md:text-2xl text-center tracking-[0.01em]">

            Bold Food. Real Values. Rochester Proud.
          </p>
          <Link
            to="/our-story"
            className="sm:absolute sm:right-10 inline-flex items-center rounded-full border-[1.5px] border-gold-foreground px-6 py-2 display text-[10px] tracking-[0.16em] text-gold-foreground hover:bg-gold-foreground hover:text-gold transition"
          >
            Our Story
          </Link>
        </div>
      </section>
    </>
  );
}
