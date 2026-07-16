import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Facebook, Apple, PlayCircle } from "lucide-react";

const ORDER_URL = "https://ordergothamhalal.com";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "About", to: "/about" },
  { label: "Locations", to: "/locations" },
  { label: "Contact", to: "/contact" },
] as const;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
  { label: "iOS App", href: "#", Icon: Apple },
  { label: "Android App", href: "#", Icon: PlayCircle },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="px-3 md:px-6 pt-4 md:pt-5">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-center gap-3 rounded-full bg-nav text-nav-foreground pl-5 pr-2 py-2">
          {/* Wordmark */}
          <Link to="/" className="shrink-0 pr-4 md:pr-6">
            <span className="text-lg md:text-xl font-black tracking-tight uppercase">
              Gotham<span className="text-[oklch(0.85_0.16_90)]">&amp;</span>Halal
            </span>
          </Link>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 flex-1 justify-center text-[12px] font-bold uppercase tracking-[0.2em]">
            {NAV.map((n) => {
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={active ? "text-nav-foreground" : "text-nav-foreground/85 hover:text-nav-foreground"}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <div className="hidden xl:flex items-center gap-1 pr-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center w-8 h-8 text-nav-foreground/85 hover:text-nav-foreground"
                >
                  <Icon className="w-[18px] h-[18px]" />
                </a>
              ))}
              <span
                aria-label="Halal Certified"
                title="Halal Certified"
                className="ml-1 inline-flex items-center justify-center h-8 px-1 text-nav-foreground text-base"
              >
                حلال
              </span>
            </div>

            <a
              href={ORDER_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex rounded-full bg-background text-foreground px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em] hover:brightness-95 transition"
            >
              Order Now
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-nav-foreground hover:bg-nav-foreground/10"
              aria-label="Toggle menu"
            >
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 rounded-3xl bg-nav text-nav-foreground p-3">
            <ul className="flex flex-col">
              {NAV.map((n) => {
                const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
                return (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className={`block rounded-2xl px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] ${active ? "bg-nav-foreground/10" : "text-nav-foreground/85"}`}
                    >
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
