import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Music2 } from "lucide-react";

const ORDER_URL = "https://ordergothamhalal.com";

const LINKS = [
  { label: "Menu", to: "/menu" },
  { label: "Catering", to: "/catering" },
  { label: "Locations", to: "/locations" },
  { label: "Our Story", to: "/our-story" },
  { label: "Rewards", to: "/rewards" },
  { label: "Franchise", to: "/franchise" },
  { label: "Careers", to: "/careers" },
  { label: "Media", to: "/media" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink text-nav-foreground border-t border-gold/20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-14 grid gap-10 md:grid-cols-4">
        <div className="space-y-4">
          <img src="/gotham-halal-logo.svg" alt="Gotham Halal" className="h-20 w-auto" />
          <p className="text-sm text-nav-foreground/70 max-w-xs">
            Hand-zabihah halal smash burgers, fried chicken and wraps. Rochester born, community driven.
          </p>
          <div className="flex gap-2">
            {[
              { label: "Instagram", Icon: Instagram },
              { label: "TikTok", Icon: Music2 },
              { label: "Facebook", Icon: Facebook },
            ].map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gold/35 text-gold hover:bg-gold hover:text-gold-foreground transition"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="display text-gold text-sm tracking-[0.22em] mb-4">Explore</h3>
          <ul className="grid grid-cols-2 gap-y-2 text-sm text-nav-foreground/80">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-gold transition">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="display text-gold text-sm tracking-[0.22em] mb-4">Visit</h3>
          <p className="text-sm text-nav-foreground/80 leading-relaxed">
            Address coming soon
            <br />
            Rochester, NY
            <br />
            <span className="text-nav-foreground/60">Hours to be announced</span>
          </p>
        </div>

        <div>
          <h3 className="display text-gold text-sm tracking-[0.22em] mb-4">Order</h3>
          <a href={ORDER_URL} target="_blank" rel="noreferrer" className="pill-gold px-6 py-3 text-[11px]">
            Order Now
          </a>
        </div>
      </div>

      <div className="border-t border-gold/15">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-5 flex flex-col sm:flex-row gap-2 justify-between text-[11px] uppercase tracking-[0.2em] text-nav-foreground/55">
          <span>© {new Date().getFullYear()} Gotham Halal</span>
          <span>100% Hand-Zabihah Halal</span>
        </div>
      </div>
    </footer>
  );
}
