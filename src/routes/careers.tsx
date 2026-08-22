import { createFileRoute } from "@tanstack/react-router";
import { CareersForm } from "@/components/CareersForm";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Join the Gotham Halal Crew" },
      { name: "description", content: "Apply to work at Gotham Halal in Rochester, NY. Grill, counter, trailer and shift lead roles with flexible shifts and real training." },
      { property: "og:title", content: "Careers — Gotham Halal" },
      { property: "og:description", content: "Flexible shifts, real training and room to grow at Rochester's halal smash burger spot." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

const CULTURE = [
  { title: "Flexible shifts", copy: "Built around school and life." },
  { title: "Real training", copy: "No experience needed. We teach the line." },
  { title: "Grow with us", copy: "Second location opening. More coming." },
];

function CareersPage() {
  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto max-w-[1500px] px-5 py-12 md:px-10 lg:py-16">
          <p className="display text-[11px] tracking-[0.24em] text-gold">Now hiring</p>
          <h1 className="display mt-3 text-[2.5rem] leading-[0.9] tracking-[-0.02em] text-white sm:text-[3.25rem] lg:text-[3.75rem]">
            <span className="block">Join The</span>
            <span className="block text-gold">Crew</span>
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-snug text-white/85">
            Gotham Halal is a growing Rochester halal brand opening a second location. We&apos;re
            adding people to the grill, the counter and the trailer — apply below.
          </p>
        </div>
      </section>

      <section className="border-y border-gold/15 bg-ink">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-5 py-9 md:grid-cols-3 md:px-10">
          {CULTURE.map((c) => (
            <div key={c.title} className="min-w-0">
              <h2 className="display text-[15px] leading-none tracking-[0.03em] text-gold uppercase">{c.title}</h2>
              <p className="mt-2 text-[13.5px] leading-snug text-white/85">{c.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink" aria-labelledby="careers-form">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-10">
          <h2 id="careers-form" className="display text-2xl tracking-[0.01em] text-gold md:text-[32px]">
            Apply Now
          </h2>
          <p className="mt-2 text-sm text-white/75">
            Fill this out and we&apos;ll reach out if there&apos;s a fit.
          </p>
          <div className="mt-7">
            <CareersForm />
          </div>
        </div>
      </section>
    </>
  );
}
