import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Leaf, Flame, Building2, Apple, Play } from "lucide-react";
import { MediaSlot } from "@/components/MediaSlot";
import { FEATURED_DISHES } from "@/data/menu";
import { assertMenuSource } from "@/data/menu.check";
import heroBg from "@/assets/gotham-hero-bg.png.asset.json";
import footerBand from "@/assets/gotham-footer-band.png.asset.json";


assertMenuSource();

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gotham Halal — Bold. Halal. Gotham." },
      {
        name: "description",
        content:
          "Halal smash burgers and loaded fries made fresh daily in Rochester, NY. Built for flavor. Made for you.",
      },
      { property: "og:title", content: "Gotham Halal — Bold. Halal. Gotham." },
      {
        property: "og:description",
        content:
          "Halal smash burgers and loaded fries made fresh daily in Rochester, NY.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const PILLARS = [
  { Icon: BadgeCheck, title: "100% Halal", copy: "Premium hand-cut halal meats. Always." },
  { Icon: Leaf, title: "Fresh Ingredients", copy: "Never frozen. Made to order." },
  { Icon: Flame, title: "Bold Flavor", copy: "Big flavor. No shortcuts. Ever." },
  { Icon: Building2, title: "ROC Roots", copy: "Born in Rochester. Community driven." },
];

const HIGHLIGHTS = FEATURED_DISHES;

function Home() {
  return (
    <>
      {/* ---------------- HERO — grunge black-to-gold artwork background ---------------- */}
      <section
        id="home"
        className="relative isolate -mt-20 flex items-center overflow-hidden bg-ink bg-cover bg-center bg-no-repeat pt-20 scroll-mt-24 md:-mt-[88px] md:pt-[88px] lg:aspect-[5/2]"
        style={{ backgroundImage: `url(${heroBg.url})` }}
      >


        <div className="relative z-20 mx-auto grid max-w-[1500px] items-center gap-8 px-5 py-10 md:px-10 lg:grid-cols-[minmax(0,40%)_minmax(0,60%)] lg:gap-4 lg:py-12">
          <div className="max-w-xl">
            <h1 className="display text-[3.25rem] leading-[0.86] tracking-[-0.035em] text-white sm:text-[4rem] lg:text-[4.25rem] xl:text-[5rem]">
              <span className="block">Bold.</span>
              <span className="block text-gold">Halal.</span>
              <span className="block">Gotham.</span>
            </h1>
            <p className="mt-6 max-w-sm text-[17px] leading-snug text-white/90">
              Halal smash burgers and loaded fries made fresh daily. Built for flavor. Made
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

          <div className="mt-8 grid items-stretch gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item, i) => (
              <article
                key={item.name}
                className={`flex h-full gap-4 ${
                  i > 0 ? "lg:border-l lg:border-gold-foreground/25 lg:pl-8" : ""
                }`}
              >
                <div className="aspect-square w-[42%] shrink-0">
                  <MediaSlot ratio="square" tone="gold" label={item.name} className="h-full" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <h3 className="display line-clamp-2 min-h-[2.4em] text-[15px] leading-tight tracking-[0.01em] text-gold-foreground">
                      {item.name}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[13px] leading-snug text-gold-foreground/85">
                      {item.copy}
                    </p>
                  </div>
                  <a
                    href="/menu"
                    className="display mt-4 inline-flex h-9 w-[8.5rem] shrink-0 items-center justify-center rounded-full border-[1.5px] border-gold-foreground px-4 text-[10.5px] leading-none tracking-[0.14em] text-gold-foreground transition hover:bg-gold-foreground hover:text-gold"
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
      <section
        className="relative w-full bg-gold bg-cover bg-center bg-no-repeat aspect-[2560/260]"
        style={{ backgroundImage: `url(${footerBand.url})` }}
        aria-label="Bold Food. Real Values. Rochester Proud."
      />

    </>
  );
}
