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
        <div className="mx-auto max-w-7xl px-5 md:px-8 pt-6 md:pt-10 pb-16 md:pb-24 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
          <div className="md:col-span-7">
            <div className="text-[11px] md:text-xs font-black uppercase tracking-[0.28em] text-foreground">
              Halal Smashed Burgers, Loaded Fries, and Dirty Sodas
            </div>
            <h1 className="mt-8 font-display text-[22vw] md:text-[15rem] leading-[0.85] tracking-tight">
              <span className="block">Fresh.</span>
              <span className="block">Pure.</span>
              <span className="block">Halal.</span>
            </h1>
            <div className="mt-10 max-w-lg space-y-3 text-lg md:text-xl font-bold text-foreground leading-tight uppercase tracking-tight">
              <p>Smashed burgers, loaded fries, and dirty sodas.</p>
              <p>Crafted the same way in every kitchen we open.</p>
            </div>
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

      {/* STATS BAND (dark) */}
      <section className="bg-nav text-nav-foreground">
        <div className="mx-auto max-w-7xl px-5 md:px-8 py-14 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-center">
          {[
            { n: "100%", l: "Halal Beef" },
            { n: "5", l: "Signature Burgers" },
            { n: "7", l: "Dirty Sodas" },
            { n: "1", l: "Gotham Sauce" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-7xl md:text-9xl text-primary-foreground leading-none">{s.n}</div>
              <div className="mt-4 text-[11px] md:text-xs font-black uppercase tracking-[0.28em] text-nav-foreground/70">{s.l}</div>
            </div>
          ))}
        </div>
      </section>


      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-7xl px-5 md:px-8 py-20 md:py-28">
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
      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-6">

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
