import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Music2 } from "lucide-react";

const LINKS = [
  { label: "Menu", to: "/menu" },
  { label: "Catering", to: "/catering" },
  { label: "Locations", to: "/locations" },
  { label: "Our Story", to: "/our-story" },
  { label: "Rewards", to: "/rewards" },
  { label: "Franchise", to: "/franchise" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
] as const;

const SOCIALS = [
  { label: "Instagram", Icon: Instagram },
  { label: "TikTok", Icon: Music2 },
  { label: "Facebook", Icon: Facebook },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-12 md:grid-cols-[1.2fr_1fr_auto] md:px-8">
        <div className="space-y-4">
          <img src="/gotham-halal-logo.svg" alt="Gotham Halal" className="h-16 w-auto" />
          <p className="max-w-xs text-sm text-white/60">
            Halal burgers, fried chicken &amp; sandwiches made fresh daily. Born in Rochester, NY.
          </p>
        </div>

        <nav aria-label="Footer">
          <h3 className="display mb-4 text-[12px] tracking-[0.2em] text-gold">Explore</h3>
          <ul className="grid grid-cols-2 gap-y-2 text-sm text-white/70">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="transition hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="display mb-4 text-[12px] tracking-[0.2em] text-gold">Follow</h3>
          <div className="flex gap-2">
            {SOCIALS.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="inline-flex size-10 items-center justify-center rounded-full border border-gold/40 text-gold transition hover:bg-gold hover:text-gold-foreground"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gold/15">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-2 px-5 py-5 text-[11px] uppercase tracking-[0.2em] text-white/45 sm:flex-row md:px-8">
          <span>© {new Date().getFullYear()} Gotham Halal</span>
          <span>100% Halal · Est. 2024</span>
        </div>
      </div>
    </footer>
  );
}
