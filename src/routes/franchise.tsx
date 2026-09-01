import { createFileRoute } from "@tanstack/react-router";
import { FranchiseForm } from "@/components/FranchiseForm";

export const Route = createFileRoute("/franchise")({
  head: () => ({
    meta: [
      { title: "Franchise — Build a Gotham Halal" },
      { name: "description", content: "Bring Gotham Halal's halal smash burgers to your market. Franchise process, brand proof points and a qualified inquiry form." },
      { property: "og:title", content: "Franchise — Gotham Halal" },
      { property: "og:description", content: "Halal smash burgers, a proven Rochester brand and a playbook for new markets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/franchise" },
    ],
    links: [{ rel: "canonical", href: "/franchise" }],
  }),
  component: FranchisePage,
});

const STEPS = [
  { title: "Tell us about you", copy: "Market, capital and timeline." },
  { title: "We vet the fit", copy: "Not every market and not every operator." },
  { title: "We build together", copy: "Training, supply chain, brand playbook." },
];

const PROOF = [
  "100% Halal Certified",
  "4.7 Stars, 278 Reviews",
  "Second Location Opening",
  "Rochester Born",
];

function FranchisePage() {
  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto max-w-[1500px] px-5 py-12 md:px-10 lg:py-16">
          <p className="display text-[11px] tracking-[0.24em] text-gold">Franchise</p>
          <h1 className="display mt-3 text-[2.5rem] leading-[0.9] tracking-[-0.02em] text-white sm:text-[3.25rem] lg:text-[3.75rem]">
            <span className="block">Build A</span>
            <span className="block text-gold">Gotham</span>
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-snug text-white/85">
            Bring halal smash burgers to a new market with a brand people already line up for.
          </p>
        </div>
      </section>

      <section className="border-y border-gold/15 bg-ink">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-5 py-9 md:grid-cols-3 md:px-10">
          {STEPS.map((s, i) => (
            <div key={s.title} className="flex gap-4">
              <span className="display text-3xl leading-none text-gold/60">{i + 1}</span>
              <div className="min-w-0">
                <h2 className="display text-[15px] leading-none tracking-[0.03em] text-gold uppercase">{s.title}</h2>
                <p className="mt-2 text-[13.5px] leading-snug text-white/85">{s.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-5 py-7 md:px-10">
          {PROOF.map((p, i) => (
            <span key={p} className="display flex items-center gap-6 text-[12px] tracking-[0.16em] text-white/85 uppercase">
              {p}
              {i < PROOF.length - 1 && <span className="text-gold">·</span>}
            </span>
          ))}
        </div>
      </section>

      <section className="border-t border-gold/15 bg-ink" aria-labelledby="franchise-form">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-10">
          <h2 id="franchise-form" className="display text-2xl tracking-[0.01em] text-gold md:text-[32px]">
            Franchise Inquiry
          </h2>
          <p className="mt-2 text-sm text-white/75">
            The more detail you give us, the faster we can tell you if there&apos;s a fit. Prefer email?{" "}
            <a href="mailto:Franchising@gothamhalal.com" className="text-gold hover:underline">
              Franchising@gothamhalal.com
            </a>
          </p>
          <div className="mt-7">
            <FranchiseForm />
          </div>
        </div>
      </section>
    </>
  );
}
