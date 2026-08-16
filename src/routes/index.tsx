import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Leaf, Flame, Building2, Apple, Play } from "lucide-react";
import { MediaSlot } from "@/components/MediaSlot";
import { Skyline, BridgeArch } from "@/components/Skyline";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gotham Halal — Bold. Halal. Gotham." },
      {
        name: "description",
        content:
          "Halal burgers, fried chicken & sandwiches made fresh daily in Rochester, NY. Built for flavor. Made for you.",
      },
      { property: "og:title", content: "Gotham Halal — Bold. Halal. Gotham." },
      {
        property: "og:description",
        content:
          "Halal smash burgers, fried chicken and sandwiches made fresh daily in Rochester, NY.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const PILLARS = [
  { Icon: BadgeCheck, title: "100% Halal", copy: "Premium hand-cut halal meats. Always." },
  { Icon: Leaf, title: "Fresh Ingredients", copy: "Never frozen. Made to order." },
  { Icon: Flame, title: "Bold Flavor", copy: "Big flavor. No shortcuts. Ever." },
  { Icon: Building2, title: "ROC Roots", copy: "Born in Rochester. Community driven." },
];

const HIGHLIGHTS = [
  {
    name: "Gotham Single Smash",
    copy: "Single beef patty, American cheese, caramelized onions, pickles, Gotham Sauce, sesame bun.",
  },
  {
    name: "Heatwave Double Smash",
    copy: "Double smash patties, pepper jack cheese, jalapeños, spicy aioli, pickles, sesame bun.",
  },
  {
    name: "Red Moon Smash Burger",
    copy: "Double smash patties, hot Cheeto crunch, pepper jack cheese, pickled jalapeños, Red Moon sauce, sesame bun.",
  },
  {
    name: "Crime Scene Fries",
    copy: "Fries loaded with beef bacon, jalapeños, cheese sauce, ranch drizzle, chopped Gotham Sauce.",
  },
];

function Diamond() {
  return <span className="inline-block size-2 rotate-45 bg-gold" aria-hidden="true" />;
}

function Home() {
  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section id="home" className="relative isolate overflow-hidden bg-gold scroll-mt-24">
        {/* black right third + ragged transition */}
        <div className="absolute inset-y-0 right-0 w-full bg-ink lg:w-[34%]" aria-hidden="true" />
        <div
          className="absolute inset-y-0 right-0 hidden w-[42%] bg-ink lg:block"
          aria-hidden="true"
          style={{
            clipPath:
              "polygon(28% 0%, 100% 0%, 100% 100%, 26% 100%, 31% 94%, 22% 88%, 30% 82%, 21% 75%, 29% 69%, 20% 63%, 30% 57%, 22% 50%, 31% 44%, 21% 38%, 29% 31%, 20% 25%, 30% 18%, 23% 11%, 30% 6%)",
          }}
        />
        <span className="absolute left-[62.5%] top-[22%] hidden size-3 rotate-45 bg-ink lg:block" aria-hidden="true" />
        <span className="absolute left-[60%] top-[46%] hidden size-2 rounded-full bg-ink lg:block" aria-hidden="true" />
        <span className="absolute left-[63%] top-[68%] hidden size-4 rounded-full bg-ink lg:block" aria-hidden="true" />
        <span className="absolute left-[59%] top-[82%] hidden size-1.5 rounded-full bg-ink lg:block" aria-hidden="true" />

        {/* thin gold bridge line-art, upper right over the black */}
        <BridgeArch className="pointer-events-none absolute right-[2%] top-4 z-10 hidden w-[26%] max-w-[380px] text-gold/75 lg:block" />

        <div className="relative z-20 mx-auto grid max-w-[1500px] items-center gap-8 px-5 py-12 md:px-8 lg:grid-cols-[minmax(0,44%)_minmax(0,56%)] lg:py-16">
          {/* ink slab with headline */}
          <div className="rounded-[2rem] bg-ink px-7 py-9 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] md:px-10 md:py-11">
            <h1 className="display text-[3.25rem] leading-[0.88] tracking-[-0.03em] text-white sm:text-[4rem] lg:text-[4.75rem] xl:text-[5.5rem]">
              <span className="block">Bold.</span>
              <span className="block text-gold">Halal.</span>
              <span className="block">Gotham.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-snug text-white/85">
              Halal burgers, fried chicken &amp; sandwiches made fresh daily. Built for flavor. Made
              for you.
            </p>
            <Link
              to="/menu"
              className="pill-ghost-dark mt-7 px-9 py-3 text-[12px]"
            >
              View Menu
            </Link>
          </div>

          {/* hero food photography */}
          <div className="h-56 sm:h-72 lg:h-[22rem]">
            <MediaSlot
              fill
              tone="gold"
              label="Hero photo — three smash burgers (transparent PNG)"
            />
          </div>
        </div>
      </section>

      {/* ---------------- FOUR PILLARS ---------------- */}
      <section className="bg-ink">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-x-6 gap-y-9 px-5 py-10 md:px-8 lg:grid-cols-4 lg:py-12">
          {PILLARS.map(({ Icon, title, copy }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <Icon className="size-9 shrink-0 text-gold" strokeWidth={1.5} />
              <h3 className="display text-[13px] tracking-[0.14em] text-white">{title}</h3>
              <p className="max-w-[16rem] text-[13px] leading-snug text-white/65">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- MENU HIGHLIGHTS ---------------- */}
      <section id="menu-highlights" className="scroll-mt-24 bg-ink pb-16 pt-6">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="mb-10 flex items-center justify-center gap-4">
            <Diamond />
            <h2 className="display text-center text-2xl tracking-[0.06em] text-gold md:text-[34px]">
              Menu Highlights
            </h2>
            <Diamond />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item) => (
              <article key={item.name} className="flex flex-col">
                <div className="overflow-hidden rounded-2xl border-2 border-gold/70 bg-black/40 p-1.5">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl">
                    <MediaSlot fill label={item.name} className="border-0" />
                  </div>
                </div>
                <h3 className="display mt-4 text-[15px] leading-tight tracking-[0.04em] text-white">
                  {item.name}
                </h3>
                <p className="mt-2 text-[13px] leading-snug text-white/60">{item.copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/menu" className="pill-gold px-9 py-3 text-[12px]">
              See Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- APP PROMO ---------------- */}
      <section id="app" className="scroll-mt-24 border-t border-gold/20 bg-ink">
        <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-5 py-14 md:px-8 lg:grid-cols-2">
          <div>
            <img src="/gotham-halal-logo.svg" alt="Gotham Halal" className="h-16 w-auto" />
            <h2 className="display mt-5 text-3xl leading-[0.95] text-gold md:text-[42px]">
              Get the Gotham Halal App
            </h2>
            <p className="mt-3 max-w-md text-[15px] text-white/70">
              Order ahead, earn rewards, and get it delivered.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { Icon: Apple, top: "Download on the", bottom: "App Store" },
                { Icon: Play, top: "Get it on", bottom: "Google Play" },
              ].map(({ Icon, top, bottom }) => (
                <a
                  key={bottom}
                  href="#app"
                  className="inline-flex items-center gap-3 rounded-xl border border-gold/50 px-5 py-2.5 text-white transition hover:bg-gold hover:text-gold-foreground"
                >
                  <Icon className="size-6 shrink-0" />
                  <span className="text-left leading-tight">
                    <span className="block text-[9px] uppercase tracking-[0.18em] opacity-70">
                      {top}
                    </span>
                    <span className="display block text-[13px] tracking-[0.04em]">{bottom}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-[240px]">
            <MediaSlot ratio="phone" label="App screen mockup" />
          </div>
        </div>
      </section>

      {/* ---------------- CATERING ---------------- */}
      <section id="catering" className="scroll-mt-24 border-t border-gold/20 bg-ink">
        <div className="mx-auto grid max-w-[1500px] items-center gap-10 px-5 py-14 md:px-8 lg:grid-cols-2">
          <div>
            <h2 className="display text-3xl leading-[0.95] text-gold md:text-[42px]">
              Catering That Hits Different
            </h2>
            <p className="mt-3 max-w-md text-[15px] text-white/70">
              Feed the crew without the stress. We&apos;ve got you covered.
            </p>
            <Link to="/catering" className="pill-gold mt-6 px-9 py-3 text-[12px]">
              Catering
            </Link>
          </div>
          <div className="h-60 md:h-72">
            <MediaSlot fill label="Catering platter — loaded fries & burgers" />
          </div>
        </div>
      </section>

      {/* ---------------- GOLD SLOGAN / SKYLINE BAND ---------------- */}
      <section className="relative overflow-hidden bg-gold pb-20 pt-10">
        <div className="relative z-10 mx-auto flex max-w-[1500px] flex-col items-center gap-5 px-5 md:px-8 lg:flex-row lg:justify-between">
          <p className="display flex-1 text-center text-xl leading-tight tracking-[0.02em] text-gold-foreground md:text-[30px] lg:text-left">
            Bold Food. Real Values. Rochester Proud.
          </p>
          <Link
            to="/our-story"
            className="display inline-flex shrink-0 items-center rounded-full bg-gold-foreground px-8 py-3 text-[11px] tracking-[0.16em] text-gold transition hover:brightness-125"
          >
            Our Story
          </Link>
        </div>
        <Skyline className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-gold-foreground md:h-20" />
      </section>
    </>
  );
}
