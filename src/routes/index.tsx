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

function Home() {
  return (
    <>
      {/* ---------------- HERO — black left, gold right, ragged edge ---------------- */}
      <section id="home" className="relative isolate overflow-hidden bg-ink scroll-mt-24">
        {/* gold panel on the right with a ragged paint edge biting into the black */}
        <div
          className="absolute inset-y-0 right-0 hidden w-[62%] bg-gold lg:block"
          aria-hidden="true"
          style={{
            clipPath:
              "polygon(100% 0%, 100% 100%, 6% 100%, 9% 96%, 5.5% 92%, 8% 88%, 4% 84%, 7% 80%, 3.5% 76%, 6.5% 72%, 3% 68%, 7.5% 64%, 4.5% 60%, 8% 56%, 4% 52%, 6% 48%, 3% 44%, 7% 40%, 4% 36%, 8.5% 32%, 5% 28%, 7.5% 24%, 3.5% 20%, 6.5% 16%, 4% 12%, 8% 8%, 5% 4%, 9% 0%)",
          }}
        />
        {/* spatter flecks trailing into the black */}
        <span className="absolute left-[36%] top-[18%] hidden size-2.5 rotate-45 bg-gold lg:block" aria-hidden="true" />
        <span className="absolute left-[34%] top-[42%] hidden size-1.5 rounded-full bg-gold lg:block" aria-hidden="true" />
        <span className="absolute left-[37%] top-[63%] hidden size-3 rounded-full bg-gold lg:block" aria-hidden="true" />
        <span className="absolute left-[33.5%] top-[82%] hidden size-2 rounded-full bg-gold lg:block" aria-hidden="true" />

        {/* bridge line-art watermark over the gold, upper right */}
        <BridgeArch className="pointer-events-none absolute right-[8%] top-0 z-0 hidden h-full w-[34%] max-w-[520px] text-gold-foreground/15 lg:block" />

        <div className="relative z-20 mx-auto grid max-w-[1500px] items-center gap-8 px-5 py-10 md:px-10 lg:grid-cols-[minmax(0,40%)_minmax(0,60%)] lg:gap-4 lg:py-12">
          <div className="max-w-xl">
            <h1 className="display text-[3.5rem] leading-[0.86] tracking-[-0.035em] text-white sm:text-[4.5rem] lg:text-[5rem] xl:text-[5.75rem]">
              <span className="block">Bold.</span>
              <span className="block">Halal.</span>
              <span className="block text-gold">Gotham.</span>
            </h1>
            <p className="mt-6 max-w-sm text-[17px] leading-snug text-white/90">
              Halal burgers, fried chicken &amp; sandwiches made fresh daily. Built for flavor. Made
              for you.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#menu-highlights" className="pill-ghost-dark px-8 py-2.5 text-[12px]">
                Order Now
              </a>
              <Link to="/menu" className="pill-ghost-dark px-8 py-2.5 text-[12px]">
                View Menu
              </Link>
            </div>
          </div>

          {/* hero food photography */}
          <div className="h-64 sm:h-80 lg:h-[26rem]">
            <MediaSlot fill tone="gold" label="Hero photo — three smash burgers (transparent PNG)" />
          </div>
        </div>
      </section>

      {/* ---------------- FOUR PILLARS ---------------- */}
      <section className="border-y border-gold/15 bg-ink">
        <div className="mx-auto grid max-w-[1500px] grid-cols-1 px-5 py-7 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
          {PILLARS.map(({ Icon, title, copy }, i) => (
            <div
              key={title}
              className={`flex items-center gap-4 px-0 py-4 sm:px-6 lg:py-1 ${
                i > 0 ? "lg:border-l lg:border-gold/25" : ""
              }`}
            >
              <Icon className="size-9 shrink-0 text-gold" strokeWidth={1.4} />
              <div className="min-w-0">
                <h3 className="display text-[15px] leading-none tracking-[0.03em] text-gold">
                  {title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-tight text-white/85">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- MENU HIGHLIGHTS — gold band ---------------- */}
      <section id="menu-highlights" className="scroll-mt-24 bg-gold pb-12 pt-8">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10">
          <div className="text-center">
            <p className="display text-[12px] tracking-[0.2em] text-gold-foreground/80">
              Our Signature
            </p>
            <h2 className="display mt-1 text-3xl tracking-[-0.01em] text-gold-foreground md:text-[42px]">
              Menu Highlights
            </h2>
          </div>

          <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item, i) => (
              <article
                key={item.name}
                className={`flex items-start gap-4 ${
                  i > 0 ? "lg:border-l lg:border-gold-foreground/25 lg:pl-8" : ""
                }`}
              >
                <div className="w-[42%] shrink-0">
                  <MediaSlot ratio="square" tone="gold" label={item.name} />
                </div>
                <div className="min-w-0">
                  <h3 className="display text-[15px] leading-tight tracking-[0.01em] text-gold-foreground">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-[13px] leading-snug text-gold-foreground/85">
                    {item.copy}
                  </p>
                  <a
                    href="#menu-highlights"
                    className="display mt-3 inline-flex items-center rounded-full border-[1.5px] border-gold-foreground px-5 py-1.5 text-[10.5px] tracking-[0.14em] text-gold-foreground transition hover:bg-gold-foreground hover:text-gold"
                  >
                    Order Now
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- APP + CATERING — split row ---------------- */}
      <section id="app" className="scroll-mt-24 bg-ink">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 py-10 md:px-10 lg:grid-cols-2 lg:gap-0">
          {/* App */}
          <div className="flex items-center gap-6 lg:pr-10">
            <div className="hidden w-[26%] max-w-[150px] shrink-0 sm:block">
              <MediaSlot ratio="phone" label="App phone mockup" />
            </div>
            <div className="min-w-0">
              <h2 className="display text-2xl leading-none tracking-[0.01em] text-gold md:text-[30px]">
                Get the Gotham Halal App
              </h2>
              <p className="mt-3 max-w-sm text-[14px] leading-snug text-white/85">
                Order ahead, skip the line, earn rewards every time you eat with us.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {[
                  { Icon: Apple, top: "Download on the", bottom: "App Store" },
                  { Icon: Play, top: "Get it on", bottom: "Google Play" },
                ].map(({ Icon, top, bottom }) => (
                  <a
                    key={bottom}
                    href="#app"
                    className="inline-flex items-center gap-2.5 rounded-lg border border-gold/50 px-4 py-2 text-white transition hover:bg-gold hover:text-gold-foreground"
                  >
                    <Icon className="size-5 shrink-0" />
                    <span className="text-left leading-tight">
                      <span className="block text-[8px] uppercase tracking-[0.16em] opacity-70">
                        {top}
                      </span>
                      <span className="display block text-[12px] tracking-[0.02em]">{bottom}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Catering */}
          <div
            id="catering"
            className="flex scroll-mt-24 items-center gap-6 lg:border-l lg:border-gold/20 lg:pl-10"
          >
            <div className="min-w-0 flex-1">
              <h2 className="display text-2xl leading-none tracking-[0.01em] text-gold md:text-[30px]">
                Catering That Hits Different
              </h2>
              <p className="mt-3 max-w-sm text-[14px] leading-snug text-white/85">
                From office lunches to events, we&apos;ve got you covered.
              </p>
              <Link to="/catering" className="pill-gold mt-5 px-7 py-2.5 text-[11px]">
                Cater With Us
              </Link>
            </div>
            <div className="hidden h-40 w-[45%] shrink-0 sm:block">
              <MediaSlot fill label="Catering trays" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- GOLD SLOGAN / SKYLINE BAND ---------------- */}
      <section className="relative overflow-hidden bg-gold">
        <Skyline className="pointer-events-none absolute bottom-0 left-0 h-full w-[20%] text-gold-foreground" />
        <div className="relative z-10 mx-auto flex max-w-[1500px] flex-col items-center gap-4 px-5 py-5 md:px-10 lg:flex-row lg:justify-center lg:gap-10 lg:pl-[22%] lg:pr-[14%]">

          <p className="display text-center text-xl leading-none tracking-[0.01em] text-gold-foreground md:text-[30px]">
            Bold Food. Real Values. <span className="text-ink">Rochester Proud.</span>
          </p>
          <Link
            to="/our-story"
            className="display inline-flex shrink-0 items-center rounded-full border-[1.5px] border-gold-foreground px-7 py-2.5 text-[11px] tracking-[0.16em] text-gold-foreground transition hover:bg-gold-foreground hover:text-gold lg:absolute lg:right-10"
          >
            Our Story
          </Link>
        </div>
      </section>
    </>
  );
}
