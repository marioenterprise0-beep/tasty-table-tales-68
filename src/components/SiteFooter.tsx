import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
import { INSTAGRAM_URL } from "@/components/InstagramFeed";
import { LOCATIONS, fullAddress } from "@/data/locations";

const PHONE = "(585) 946-8426";


const LINKS = [
  { label: "Menu", to: "/menu" },
  { label: "Catering", to: "/catering" },
  { label: "Locations", to: "/locations" },
  { label: "Our Story", to: "/our-story" },
  { label: "Rewards", to: "/rewards" },
  { label: "Blog", to: "/blog" },
  { label: "Franchise", to: "/franchise" },
  { label: "Careers", to: "/careers" },
  { label: "Contact", to: "/contact" },
] as const;

const SOCIALS = [{ label: "Instagram", href: INSTAGRAM_URL, Icon: Instagram }] as const;

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-12 md:grid-cols-[1.2fr_1fr_1fr_auto] md:px-8">
        <div className="space-y-4">
          <img src="/gotham-halal-logo.svg" alt="Gotham Halal" className="h-16 w-auto" />
          <p className="max-w-xs text-sm text-white/60">
            Halal smash burgers and loaded fries made fresh daily. Born in Rochester, NY.
          </p>
          <a
            href={`tel:${PHONE.replace(/[^\d+]/g, "")}`}
            className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-gold"
          >
            <Phone className="size-4 text-gold" />
            {PHONE}
          </a>
          <a
            href="mailto:hello@gothamhalal.com"
            className="inline-flex items-center gap-2 text-sm text-white/80 transition hover:text-gold"
          >
            <Mail className="size-4 text-gold" />
            hello@gothamhalal.com
          </a>
        </div>

        <div>
          <h3 className="display mb-4 text-[12px] tracking-[0.2em] text-gold">Visit</h3>
          <ul className="space-y-3 text-sm text-white/70">
            {LOCATIONS.map((l) => (
              <li key={l.slug}>
                <span className="display block text-[11px] tracking-[0.16em] text-white/90">
                  {l.shortName}
                  {l.status === "opening_soon" ? " — Opening Soon" : ""}
                </span>
                <address className="not-italic">{fullAddress(l)}</address>
              </li>
            ))}
          </ul>
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
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
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
          <span className="flex gap-5">
            <Link to="/privacy" className="transition hover:text-gold">
              Privacy Policy
            </Link>
            <Link to="/terms" className="transition hover:text-gold">
              Terms of Service
            </Link>
          </span>
          <span>100% Halal · Est. 2024</span>
        </div>
      </div>
    </footer>
  );
}
