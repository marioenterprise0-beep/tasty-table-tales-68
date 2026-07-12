import { createFileRoute, Link } from "@tanstack/react-router";
import { MediaSlot } from "@/components/MediaSlot";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Gotham Halal" },
      { name: "description", content: "The story behind Gotham Halal — 100% halal smashed burgers, made loud and made honest." },
      { property: "og:title", content: "About — Gotham Halal" },
      { property: "og:description", content: "The story behind Gotham Halal." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 md:px-8 pt-12 md:pt-20 pb-6">
        <div className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-foreground/80">Our Story</div>
        <h1 className="mt-5 font-display text-[18vw] md:text-[12rem] leading-[0.88]">Made in<br/>Gotham.</h1>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-12 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7 space-y-6 text-lg text-foreground/85 leading-relaxed">
          <p>
            Gotham Halal started with a simple idea: a smash burger you can actually stand behind. 100% halal beef, cranked out on a screaming griddle, lace-edge crispy, stacked with American cheese and our house-made Gotham Sauce.
          </p>
          <p>
            No shortcuts. No apologies. Same burger, same sauce, same standard — every ticket, every night.
          </p>
          <p>
            We built this for the late crew, the family run, the "one more" order at 11pm. Halal, honest, and loud.
          </p>
        </div>
        <div className="md:col-span-5">
          <MediaSlot label="Kitchen — swap in team photo" ratio="portrait" icon="🔥" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "100% Halal", desc: "Every patty. Every day. No exceptions." },
            { title: "Smashed To Order", desc: "Ground fresh, smashed on the flat top the moment you order." },
            { title: "Gotham Sauce", desc: "House recipe. Tangy, smoky, a little smoky. That's all we'll say." },
          ].map((c) => (
            <div key={c.title} className="rounded-[1.75rem] bg-nav text-nav-foreground p-8">
              <h3 className="font-display text-3xl md:text-4xl text-primary-foreground">{c.title}</h3>
              <p className="mt-3 text-sm text-nav-foreground/80">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 md:px-8 pb-4">
        <div className="rounded-[2rem] md:rounded-[2.5rem] bg-nav text-nav-foreground p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <h2 className="font-display text-5xl md:text-7xl text-primary-foreground max-w-2xl">Come taste it for yourself.</h2>
          <Link
            to="/menu"
            className="rounded-full bg-primary-foreground text-primary px-8 py-4 text-[12px] font-black uppercase tracking-[0.22em] hover:brightness-95 transition"
          >
            See the Menu →
          </Link>
        </div>
      </section>
    </>
  );
}
