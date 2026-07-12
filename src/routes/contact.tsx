import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Gotham Halal" },
      { name: "description", content: "Get in touch with Gotham Halal — questions, catering, press, and feedback." },
      { property: "og:title", content: "Contact — Gotham Halal" },
      { property: "og:description", content: "Get in touch with Gotham Halal." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-12 md:pt-20 pb-6">
        <div className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-foreground/80">Say Hey</div>
        <h1 className="mt-5 font-display text-[18vw] md:text-[12rem] leading-[0.88]">Contact.</h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/85">
          Questions, catering, press, or a note from a happy customer — we read everything.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-12 grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3 rounded-[1.75rem] bg-nav text-nav-foreground p-8 md:p-10">
          {sent ? (
            <div>
              <h2 className="font-display text-5xl text-primary-foreground">Got it.</h2>
              <p className="mt-4 text-nav-foreground/80">Thanks for reaching out — we'll be in touch.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="grid gap-4"
            >
              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.25em] text-primary-foreground/70">Name</label>
                <input required className="mt-2 w-full rounded-full bg-nav-foreground/10 text-nav-foreground placeholder:text-nav-foreground/40 px-5 py-3 outline-none focus:bg-nav-foreground/15" placeholder="Your name" />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.25em] text-primary-foreground/70">Email</label>
                <input type="email" required className="mt-2 w-full rounded-full bg-nav-foreground/10 text-nav-foreground placeholder:text-nav-foreground/40 px-5 py-3 outline-none focus:bg-nav-foreground/15" placeholder="you@example.com" />
              </div>
              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.25em] text-primary-foreground/70">Message</label>
                <textarea required rows={5} className="mt-2 w-full rounded-2xl bg-nav-foreground/10 text-nav-foreground placeholder:text-nav-foreground/40 px-5 py-3 outline-none focus:bg-nav-foreground/15" placeholder="What's on your mind?" />
              </div>
              <button
                type="submit"
                className="justify-self-start rounded-full bg-primary-foreground text-primary px-8 py-4 text-[12px] font-black uppercase tracking-[0.22em] hover:brightness-95 transition"
              >
                Send Message →
              </button>
            </form>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <InfoBlock title="General" line1="hello@gothamhalal.com" line2="(555) 555-5555" />
          <InfoBlock title="Catering" line1="catering@gothamhalal.com" line2="Feed the crew — halal, hot, on time." />
          <InfoBlock title="Press" line1="press@gothamhalal.com" line2="Media, partnerships, features." />
        </div>
      </section>
    </>
  );
}

function InfoBlock({ title, line1, line2 }: { title: string; line1: string; line2: string }) {
  return (
    <div className="rounded-[1.5rem] border-2 border-foreground/25 p-6">
      <div className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/70">{title}</div>
      <div className="mt-2 font-display text-2xl">{line1}</div>
      <div className="mt-1 text-sm text-foreground/75">{line2}</div>
    </div>
  );
}
