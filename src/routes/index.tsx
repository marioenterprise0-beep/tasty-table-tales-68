import { createFileRoute } from "@tanstack/react-router";
import burgerStack from "@/assets/burger-stack.jpg";
import smashBurger from "@/assets/smash-burger.jpg";
import loadedFries from "@/assets/loaded-fries.jpg";
import shake from "@/assets/shake.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Hours", href: "#hours" },
  { label: "Contact", href: "#contact" },
];

function Index() {
  return (
    <div id="top" className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="w-full px-4 pt-5 md:pt-7">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full bg-primary px-4 py-3 md:px-6 md:py-4 text-primary-foreground shadow-[0_10px_0_-4px_rgba(0,0,0,0.15)]">
          <a href="#top" className="flex items-center gap-2">
            <span className="font-display text-2xl md:text-3xl leading-none text-primary-foreground">
              GOTHAM<span className="text-accent">HALAL</span>
            </span>
          </a>
          <ul className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-widest">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-accent transition-colors">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#order"
            className="rounded-full bg-accent px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-black uppercase tracking-widest text-accent-foreground hover:brightness-95 transition"
          >
            Order Now
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-6 pt-10 pb-6 md:pt-20 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-foreground/70">
              100% Halal · Smashed to order
            </p>
            <h1 className="mt-4 font-display text-[18vw] md:text-[9.5rem] text-foreground">
              SMASH<br/>THE<br/>CITY.
            </h1>
            <p className="mt-6 max-w-md text-lg font-semibold text-foreground/80">
              Crispy-edged smash burgers, loaded fries, and thick shakes.
              Built loud, served fast — Gotham style.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#order" className="rounded-full bg-primary px-7 py-4 text-sm font-black uppercase tracking-widest text-primary-foreground hover:bg-secondary transition">
                Order for Pickup
              </a>
              <a href="#menu" className="rounded-full border-2 border-primary px-7 py-4 text-sm font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition">
                See the Menu
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={burgerStack}
              alt="Towering stack of Gotham Halal smash burgers"
              width={1024}
              height={1408}
              className="mx-auto w-full max-w-md md:max-w-none drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)]"
            />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-6 py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: "100%", l: "Halal Certified" },
            { n: "3oz", l: "Fresh Smashed Patties" },
            { n: "7", l: "Signature Burgers" },
            { n: "★★★★★", l: "Neighborhood Favorite" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl md:text-6xl text-accent">{s.n}</div>
              <div className="mt-2 text-xs md:text-sm font-bold uppercase tracking-widest">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* MENU HIGHLIGHTS */}
      <section id="menu" className="mx-auto max-w-6xl px-6 py-16 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-foreground/70">The Signature Menu</p>
          <h2 className="mt-3 font-display text-6xl md:text-8xl text-foreground">
            Loud. Juicy.<br/>Unforgettable.
          </h2>
          <p className="mt-4 text-lg font-semibold text-foreground/80">
            Every patty smashed on the flat top. Every bun toasted in butter. Every bite worth the drive.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { img: smashBurger, name: "Double Smash", desc: "Two 3oz halal beef patties, American cheese, pickles, Gotham sauce." },
            { img: loadedFries, name: "Loaded Fries", desc: "Golden fries topped with smashed beef, molten cheese and scallions." },
            { img: shake, name: "Thick Shakes", desc: "Chocolate, vanilla, strawberry — real ice cream, whipped high." },
          ].map((c) => (
            <article key={c.name} className="rounded-[2rem] bg-card p-6 md:p-8 border-4 border-primary shadow-[8px_8px_0_0_var(--primary)]">
              <div className="aspect-square rounded-2xl bg-background/60 flex items-center justify-center overflow-hidden">
                <img src={c.img} alt={c.name} width={900} height={900} loading="lazy" className="w-full h-full object-contain" />
              </div>
              <h3 className="mt-6 font-display text-4xl text-primary">{c.name}</h3>
              <p className="mt-2 text-base font-medium text-foreground/80">{c.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28 text-center">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-accent">Our Story</p>
          <h2 className="mt-4 font-display text-6xl md:text-8xl">
            Halal <span className="text-accent">done loud.</span>
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg font-medium text-primary-foreground/85">
            Gotham Halal was built for the ones who want it loud, juicy, and honest. 100% halal beef,
            crispy lace-edge smash patties, buttery toasted brioche, and sauces we make in-house.
            No shortcuts. No apologies. Just a serious burger, done right.
          </p>
        </div>
      </section>

      {/* ORDER / HOURS / CONTACT */}
      <section id="order" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-[2rem] bg-primary text-primary-foreground p-8 md:p-12">
            <h2 className="font-display text-5xl md:text-6xl text-accent">Order Ahead</h2>
            <p className="mt-4 text-base md:text-lg font-medium text-primary-foreground/85">
              Skip the line — order online for pickup and we'll have it hot and ready when you arrive.
            </p>
            <a href="#" className="mt-8 inline-block rounded-full bg-accent px-7 py-4 text-sm font-black uppercase tracking-widest text-accent-foreground hover:brightness-95 transition">
              Start your order
            </a>
          </div>
          <div id="hours" className="rounded-[2rem] border-4 border-primary p-8 md:p-12">
            <h2 className="font-display text-5xl md:text-6xl text-primary">Hours</h2>
            <ul className="mt-6 space-y-3 text-lg font-semibold text-foreground">
              <li className="flex justify-between"><span>Mon – Thu</span><span>11:00 – 10:00</span></li>
              <li className="flex justify-between"><span>Fri</span><span>11:00 – 11:00</span></li>
              <li className="flex justify-between"><span>Sat</span><span>12:00 – 11:00</span></li>
              <li className="flex justify-between"><span>Sun</span><span>12:00 – 9:00</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="font-display text-4xl">GOTHAM<span className="text-accent">HALAL</span></div>
            <p className="mt-4 text-sm font-medium text-primary-foreground/80 max-w-xs">
              Halal smash burgers, loaded fries and thick shakes. Built loud, served fast.
            </p>
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-accent">Visit</div>
            <p className="mt-3 text-base font-semibold">Address coming soon<br/>Your City, USA</p>
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-accent">Follow</div>
            <ul className="mt-3 space-y-1 text-base font-semibold">
              <li>Instagram · @gothamhalal</li>
              <li>TikTok · @gothamhalal</li>
              <li>hello@gothamhalal.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/15">
          <div className="mx-auto max-w-6xl px-6 py-6 text-xs font-semibold uppercase tracking-widest text-primary-foreground/70 flex flex-wrap justify-between gap-3">
            <span>© {new Date().getFullYear()} Gotham Halal</span>
            <span>100% Halal · Made fresh daily</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
