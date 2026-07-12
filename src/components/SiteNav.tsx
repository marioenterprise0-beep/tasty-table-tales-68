import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Instagram, Facebook, Apple, PlayCircle } from "lucide-react";
import logoAsset from "@/assets/gotham-logo.png.asset.json";

const ORDER_URL = "https://ordergothamhalal.com";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "About", to: "/about" },
  { label: "Locations", to: "/locations" },
  { label: "Contact", to: "/contact" },
] as const;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/gothamhalal", Icon: Instagram },
  { label: "Facebook", href: "https://facebook.com/gothamhalal", Icon: Facebook },
  { label: "iOS App", href: "#", Icon: Apple },
  { label: "Android App", href: "#", Icon: PlayCircle },
] as const;


export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 px-3 md:px-6 pt-4 md:pt-5">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3 rounded-full bg-nav text-nav-foreground pl-2 pr-2 py-2 ring-1 ring-primary-foreground/25 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.7)]">
          <Link to="/" className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1 hover:opacity-90 transition-opacity shrink-0">
            <img src={logoAsset.url} alt="Gotham Halal" className="h-9 md:h-10 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-[12px] font-bold uppercase tracking-[0.16em]">
            {NAV.map((n) => {
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`transition-colors ${active ? "text-primary-foreground" : "text-nav-foreground/75 hover:text-nav-foreground"}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="hidden xl:flex items-center gap-1 pr-1 border-r border-nav-foreground/15 mr-1">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full text-nav-foreground/75 hover:text-primary-foreground hover:bg-nav-foreground/10 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <span
                aria-label="Halal Certified"
                title="Halal Certified"
                className="ml-1 inline-flex items-center justify-center h-8 px-2.5 rounded-full bg-primary-foreground text-primary text-[10px] font-black tracking-[0.15em]"
              >
                حلال
              </span>
            </div>
            <a
              href={ORDER_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex rounded-full bg-primary-foreground text-primary px-5 md:px-6 py-2.5 md:py-3 text-[12px] font-black uppercase tracking-[0.2em] hover:brightness-95 transition"
            >
              Order Now
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center rounded-full w-11 h-11 bg-nav-foreground/10 text-nav-foreground hover:bg-nav-foreground/20"
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
          <div className="lg:hidden mt-2 rounded-3xl bg-nav text-nav-foreground p-3 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.55)]">
            <ul className="flex flex-col">
              {NAV.map((n) => {
                const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
                return (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className={`block rounded-2xl px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] ${active ? "bg-nav-foreground/10 text-primary-foreground" : "text-nav-foreground/85 hover:bg-nav-foreground/5"}`}
                    >
                      {n.label}
                    </Link>
                  </li>
                );
              })}
              <li className="p-2">
                <a
                  href={ORDER_URL}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className="block text-center rounded-full bg-primary-foreground text-primary px-5 py-3 text-[12px] font-black uppercase tracking-[0.2em]"
                >
                  Order Now
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
