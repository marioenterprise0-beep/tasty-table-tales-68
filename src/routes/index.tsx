import { createFileRoute, Link } from "@tanstack/react-router";
import { MediaSlot } from "@/components/MediaSlot";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gotham Halal — Smashed Burgers, Loaded Fries, Dirty Sodas" },
      { name: "description", content: "Fresh. Halal. Smashed to order. Gotham Halal serves smashed burgers, loaded fries and dirty sodas built for Gotham nights." },
      { property: "og:title", content: "Gotham Halal — Smashed in Gotham" },
      { property: "og:description", content: "Fresh. Halal. Smashed to order." },
    ],
  }),
  component: Home,
});

const ORDER_URL = "https://ordergothamhalal.com";

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-5 md:px-8 pt-10 md:pt-16 pb-14 md:pb-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-7">
            <div className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-foreground/80">
              Halal Smashed Burgers · Loaded Fries · Dirty Sodas
            </div>
            <h1 className="mt-6 font-display text-[18vw] md:text-[11.5rem] leading-[0.88]">
              Fresh.<br/>Halal.<br/>Smashed.
            </h1>
            <p className="mt-8 max-w-lg text-lg text-foreground/85">
              Griddled to order, stacked with Gotham Sauce, and served loud. Every burger, every night, the same way.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={ORDER_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-nav text-nav-foreground px-8 py-4 text-[12px] font-black uppercase tracking-[0.22em] hover:brightness-110 transition"
              >
                Order Online
              </a>
              <Link
                to="/menu"
                className="rounded-full border-2 border-foreground text-foreground px-8 py-4 text-[12px] font-black uppercase tracking-[0.22em] hover:bg-foreground hover:text-background transition"
              >
                See the Menu
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <MediaSlot label="Burger Stack — swap in hero photo" ratio="portrait" icon="🍔" />
          </div>
        </div>
      </section>

      {/* MARQUEE STRIP */}
      <section className="bg-nav text-nav-foreground border-y border-nav-foreground/10">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-6 md:py-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center font-display text-3xl md:text-5xl">
          <span>5 Smash · $50</span>
          <span className="opacity-40">✦</span>
          <span>10 for $100</span>
          <span className="opacity-40">✦</span>
          <span>Halal Certified</span>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        {[
          { n: "100%", l: "Halal Beef" },
          { n: "5", l: "Signature Burgers" },
          { n: "7", l: "Dirty Sodas" },
          { n: "1", l: "Gotham Sauce" },
        ].map((s) => (
          <div key={s.l} className="text-center">
            <div className="font-display text-6xl md:text-8xl text-nav">{s.n}</div>
            <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.25em] text-foreground/70">{s.l}</div>
          </div>
        ))}
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-8 pb-8 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "🍔", title: "Gotham Burgers", desc: "Smashed lace-edge patties, American cheese, house Gotham Sauce.", to: "/menu" },
            { icon: "🍟", title: "Loaded Fries", desc: "Cheese, seasoned beef, jalapeños, crunch. Built to be shared — or not.", to: "/menu" },
            { icon: "🥤", title: "Dirty Sodas", desc: "Seven house sodas, all $6. Sweet, cold, and loud on ice.", to: "/menu" },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group rounded-[2rem] bg-nav text-nav-foreground p-8 hover:-translate-y-1 transition-transform"
            >
              <div className="text-5xl">{c.icon}</div>
              <h3 className="mt-6 font-display text-4xl text-primary-foreground">{c.title}</h3>
              <p className="mt-3 text-sm text-nav-foreground/80 leading-relaxed">{c.desc}</p>
              <div className="mt-6 text-[11px] font-bold uppercase tracking-[0.25em] text-primary-foreground">
                See menu →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-4 pb-4">
        <div className="rounded-[2rem] md:rounded-[2.5rem] bg-nav text-nav-foreground p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-foreground/70">Skip The Line</div>
            <h2 className="mt-3 font-display text-5xl md:text-7xl text-primary-foreground">Order online, pick it up hot.</h2>
          </div>
          <a
            href={ORDER_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-primary-foreground text-primary px-8 py-4 text-[12px] font-black uppercase tracking-[0.22em] hover:brightness-95 transition"
          >
            Order Now →
          </a>
        </div>
      </section>
    </>
  );
}
