import { createFileRoute } from "@tanstack/react-router";
import { CateringForm, CATERING_EMAIL } from "@/components/CateringForm";
import { BrandImage } from "@/components/BrandImage";
import { IMAGES } from "@/data/images";

export const Route = createFileRoute("/catering")({
  head: () => ({
    meta: [
      { title: "Catering — Gotham Halal" },
      { name: "description", content: "Halal smash burger and loaded fries catering for office lunches, parties and events in Rochester, NY." },
      { property: "og:title", content: "Catering — Gotham Halal" },
      { property: "og:description", content: "Halal catering trays of smash burgers and loaded fries for office lunches, parties and events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/catering" },
    ],
    links: [{ rel: "canonical", href: "/catering" }],
  }),
  component: CateringPage,
});

const STEPS = [
  { title: "Tell us the details", copy: "Date, headcount and what kind of event you're feeding." },
  { title: "We build the spread", copy: "Smash burger trays, loaded fries and sides sized to your crowd." },
  { title: "We show up hot", copy: "Delivered on time across the Rochester area, ready to serve." },
];

function CateringPage() {
  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto grid max-w-[1500px] items-center gap-8 px-5 py-12 md:px-10 lg:grid-cols-2 lg:py-16">
          <div className="min-w-0">
            <p className="display text-[11px] tracking-[0.24em] text-gold">Feed the crew</p>
            <h1 className="display mt-3 text-[2.5rem] leading-[0.9] tracking-[-0.02em] text-white sm:text-[3.25rem] lg:text-[3.75rem]">
              <span className="block">Catering That</span>
              <span className="block text-gold">Hits Different</span>
            </h1>
            <p className="mt-5 max-w-md text-[16px] leading-snug text-white/85">
              Halal smash burgers and loaded fries, built for office lunches, parties and events.
              Tell us what you need and we&apos;ll put together a spread that gets talked about.
            </p>
          </div>
          <div className="h-56 sm:h-72 lg:h-[22rem]">
            <BrandImage slot={IMAGES.cateringHero} fill priority />
          </div>
        </div>
      </section>

      <section className="border-y border-gold/15 bg-ink">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-5 py-9 md:grid-cols-3 md:px-10">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex gap-4">
              <span className="display text-3xl leading-none text-gold/60">{i + 1}</span>
              <div className="min-w-0">
                <h2 className="display text-[15px] leading-none tracking-[0.03em] text-gold">{s.title}</h2>
                <p className="mt-2 text-[13.5px] leading-snug text-white/85">{s.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink" aria-labelledby="catering-form">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-10">
          <h2 id="catering-form" className="display text-2xl tracking-[0.01em] text-gold md:text-[32px]">
            Request Catering
          </h2>
          <p className="mt-2 text-sm text-white/75">
            We reply within one business day. Prefer email?{" "}
            <a href={`mailto:${CATERING_EMAIL}`} className="text-gold hover:underline">
              {CATERING_EMAIL}
            </a>
          </p>
          <div className="mt-7">
            <CateringForm />
          </div>
        </div>
      </section>
    </>
  );
}
