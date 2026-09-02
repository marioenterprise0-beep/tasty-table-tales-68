import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Gotham Halal" },
      {
        name: "description",
        content:
          "Terms of service for using the Gotham Halal website, text club, and online forms.",
      },
      { property: "og:title", content: "Terms of Service — Gotham Halal" },
      {
        property: "og:description",
        content: "Terms of service for using the Gotham Halal website and services.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "Acceptance of Terms",
    body: [
      "By using the Gotham Halal website (gothamhalal.com), you agree to these Terms of Service. If you do not agree, please do not use the site.",
    ],
  },
  {
    title: "Use of the Website",
    body: [
      "The site provides information about our restaurants, menu, catering, careers, and franchising, and lets you submit inquiries and sign up for updates. You agree to provide accurate information when submitting forms and to use the site only for lawful purposes.",
    ],
  },
  {
    title: "Text Club & Marketing Messages",
    body: [
      "By opting in through our forms, you agree to receive recurring marketing text messages from GOTHAM HALAL LLC at the phone number you provide. Message frequency varies. Message and data rates may apply. Consent is not a condition of purchase.",
      "Reply STOP to unsubscribe at any time, or use the unsubscribe page on our website. Reply HELP for help. Marketing consent is not bundled with transactional consent and is not shared with third parties.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "All content on this site — including the Gotham Halal name, logo, artwork, photos, and text — is the property of GOTHAM HALAL LLC and may not be copied or reused without written permission.",
    ],
  },
  {
    title: "Accuracy & Availability",
    body: [
      "We work to keep menu items, prices, hours, and location details accurate, but they may change without notice. The site is provided as-is and we do not guarantee uninterrupted availability.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, GOTHAM HALAL LLC is not liable for any indirect, incidental, or consequential damages arising from your use of the website.",
    ],
  },
  {
    title: "Contact",
    body: [
      "GOTHAM HALAL LLC · 2534 W Ridge Rd, Rochester, NY 14626 · (585) 946-8426 · hello@gothamhalal.com",
    ],
  },
];

function TermsPage() {
  return (
    <div className="bg-ink text-white">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <p className="display text-xs tracking-[0.3em] text-gold">Legal</p>
        <h1 className="display mt-3 text-4xl tracking-tight text-foreground md:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: September 2, 2026</p>

        <div className="mt-10 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="display text-lg tracking-wide text-gold">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-3 text-[15px] leading-relaxed text-white/80">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
