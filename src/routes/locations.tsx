import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/locations")({
  head: () => ({
    meta: [
      { title: "Locations — Gotham Halal" },
      { name: "description", content: "Find your nearest Gotham Halal — address, hours and pickup." },
      { property: "og:title", content: "Locations — Gotham Halal" },
      { property: "og:description", content: "Find your nearest Gotham Halal." },
    ],
  }),
  component: LocationsPage,
});

const ORDER_URL = "https://ordergothamhalal.com";

const HOURS = [
  { day: "Mon – Thu", hours: "11am – 10pm" },
  { day: "Fri", hours: "11am – 11pm" },
  { day: "Sat", hours: "12pm – 11pm" },
  { day: "Sun", hours: "12pm – 9pm" },
];

function LocationsPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-12 md:pt-20 pb-6">
        <div className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-foreground/80">Find Us</div>
        <h1 className="mt-5 font-display text-[18vw] md:text-[12rem] leading-[0.88]">Locations.</h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/85">
          One kitchen, one standard. More coming soon.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-[1.75rem] bg-nav text-nav-foreground p-8 md:p-10">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-foreground/70">Flagship</div>
          <h2 className="mt-3 font-display text-5xl md:text-6xl text-primary-foreground">Gotham Halal</h2>
          <p className="mt-4 text-nav-foreground/80">
            Address coming soon.<br/>
            City, State ZIP
          </p>
          <div className="mt-6 space-y-1 text-nav-foreground/85">
            <div>Phone: (555) 555-5555</div>
            <div>Email: hello@gothamhalal.com</div>
          </div>
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-full bg-primary-foreground text-primary px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em] hover:brightness-95 transition"
          >
            Order for Pickup →
          </a>
        </div>

        <div className="rounded-[1.75rem] border-2 border-foreground/25 p-8 md:p-10">
          <div className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/70">Hours</div>
          <h2 className="mt-3 font-display text-5xl md:text-6xl">Open Weekly</h2>
          <ul className="mt-6 space-y-3">
            {HOURS.map((h) => (
              <li key={h.day} className="flex justify-between border-b border-foreground/15 pb-3 last:border-0 text-base font-semibold">
                <span>{h.day}</span>
                <span>{h.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-4">
        <div className="rounded-[2rem] bg-nav text-nav-foreground p-8 md:p-12 text-center">
          <h3 className="font-display text-4xl md:text-6xl text-primary-foreground">More locations soon.</h3>
          <p className="mt-3 text-nav-foreground/80">Follow @gothamhalal for openings.</p>
        </div>
      </section>
    </>
  );
}
