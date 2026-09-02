import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Gotham Halal" },
      {
        name: "description",
        content:
          "How Gotham Halal collects, uses, and protects your information, including SMS/text club consent.",
      },
      { property: "og:title", content: "Privacy Policy — Gotham Halal" },
      {
        property: "og:description",
        content: "How Gotham Halal collects, uses, and protects your information.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "Information We Collect",
    body: [
      "When you use our website, we may collect information you provide directly: your name, email address, and phone number when you join our Text Club, sign up for opening-day updates, submit a catering request, apply for a job, inquire about franchising, or create a customer account.",
      "We also collect standard technical information such as your browser type, device, and pages visited, used for site analytics and improvement.",
    ],
  },
  {
    title: "How We Use Your Information",
    body: [
      "We use your information to respond to your requests, process catering and job inquiries, send opening-day announcements, and — only with your consent — send promotional text messages and emails about Gotham Halal offers, events, and news.",
      "Marketing consent is not bundled with transactional consent and is never shared with third parties for their own marketing purposes.",
    ],
  },
  {
    title: "SMS / Text Messaging",
    body: [
      "If you opt in to the Gotham Halal Text Club, you agree to receive marketing text messages from GOTHAM HALAL LLC. Message frequency varies. Message and data rates may apply. Consent is not a condition of purchase.",
      "You can opt out at any time by replying STOP to any message, or by using the unsubscribe link on our website. Reply HELP for help.",
    ],
  },
  {
    title: "Sharing of Information",
    body: [
      "We do not sell your personal information. We share information only with service providers that help us operate the website and communicate with you (for example, our customer relationship and messaging platform), and only for those purposes.",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You may unsubscribe from marketing emails using the link in any email, opt out of texts by replying STOP, and request deletion of your account data by contacting us at hello@gothamhalal.com.",
    ],
  },
  {
    title: "Contact",
    body: [
      "GOTHAM HALAL LLC · 2534 W Ridge Rd, Rochester, NY 14626 · (585) 946-8426 · hello@gothamhalal.com",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="bg-ink text-white">
      <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <p className="display text-xs tracking-[0.3em] text-gold">Legal</p>
        <h1 className="display mt-3 text-4xl tracking-tight text-foreground md:text-5xl">
          Privacy Policy
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
