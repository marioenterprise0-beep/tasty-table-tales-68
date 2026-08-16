import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Facebook, Music2 } from "lucide-react";

const ORDER_URL = "https://ordergothamhalal.com";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Catering", to: "/catering" },
  { label: "Locations", to: "/locations" },
  { label: "Our Story", to: "/our-story" },
  { label: "Rewards", to: "/rewards" },
  { label: "Franchise", to: "/franchise" },
] as const;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "TikTok", href: "https://tiktok.com", Icon: Music2 },
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-nav/35 text-nav-foreground backdrop-blur-xl backdrop-saturate-150 border-b border-white/10">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <div className="flex items-center gap-4 h-20 md:h-[88px]">
          <Link to="/" className="shrink-0" aria-label="Gotham Halal home">
            <img
              src="/gotham-halal-logo.svg"
              alt="Gotham Halal"
              className="h-14 md:h-16 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 justify-center display text-[12px] tracking-[0.08em] whitespace-nowrap">
            {NAV.map((n) => {
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={active ? "text-gold" : "text-nav-foreground/90 hover:text-gold transition"}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <div className="hidden md:flex items-center gap-1 pr-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center w-9 h-9 text-nav-foreground/90 hover:text-gold transition"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            <a
              href={ORDER_URL}
              target="_blank"
              rel="noreferrer"
              className="pill-gold hidden sm:inline-flex px-6 py-2.5 text-[11px]"
            >
              Order Now
            </a>
            <Link
              to="/locations"
              className="pill-outline hidden sm:inline-flex px-6 py-2.5 text-[11px]"
            >
              Find a Location
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-gold hover:bg-gold/10"
              aria-label="Toggle menu"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-6 bg-current" />
                <span className="block h-0.5 w-6 bg-current" />
                <span className="block h-0.5 w-6 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden pb-4">
            <ul className="flex flex-col rounded-2xl border border-gold/25 overflow-hidden bg-nav/90 backdrop-blur-xl">
              {NAV.map((n) => {
                const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
                return (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className={`block px-5 py-3.5 display text-[13px] tracking-[0.18em] border-b border-gold/10 ${active ? "text-gold bg-gold/10" : "text-nav-foreground/90"}`}
                    >
                      {n.label}
                    </Link>
                  </li>
                );
              })}
              <li className="p-3 flex gap-2">
                <a href={ORDER_URL} target="_blank" rel="noreferrer" className="pill-gold flex-1 px-4 py-3 text-[11px]">
                  Order Now
                </a>
                <Link to="/locations" onClick={() => setOpen(false)} className="pill-outline flex-1 px-4 py-3 text-[11px]">
                  Find a Location
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
