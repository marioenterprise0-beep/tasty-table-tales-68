import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/gotham-logo.png.asset.json";

const ORDER_URL = "https://ordergothamhalal.com";

export function SiteFooter() {
  return (
    <footer className="mt-24 md:mt-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8 pb-6">
        <div className="rounded-[2rem] md:rounded-[2.5rem] bg-nav text-nav-foreground p-8 md:p-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <img src={logoAsset.url} alt="Gotham Halal" className="h-16 md:h-20 w-auto" />
              <p className="mt-5 max-w-sm text-sm text-nav-foreground/75 leading-relaxed">
                100% halal smashed burgers, loaded fries and dirty sodas. Built for Gotham nights.
              </p>
              <a
                href={ORDER_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-full bg-primary-foreground text-primary px-6 py-3 text-[12px] font-black uppercase tracking-[0.2em] hover:brightness-95 transition"
              >
                Order Online →
              </a>
            </div>

            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-foreground">Explore</div>
              <ul className="mt-4 space-y-2 text-sm text-nav-foreground/85">
                <li><Link to="/menu" className="hover:text-primary-foreground">Menu</Link></li>
                <li><Link to="/about" className="hover:text-primary-foreground">About</Link></li>
                <li><Link to="/locations" className="hover:text-primary-foreground">Locations</Link></li>
                <li><Link to="/contact" className="hover:text-primary-foreground">Contact</Link></li>
              </ul>
            </div>

            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.3em] text-primary-foreground">Follow</div>
              <ul className="mt-4 space-y-2 text-sm text-nav-foreground/85">
                <li>Instagram · @gothamhalal</li>
                <li>TikTok · @gothamhalal</li>
                <li>X · @gothamhalal</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-nav-foreground/10 flex flex-wrap justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-nav-foreground/55">
            <span>© {new Date().getFullYear()} Gotham Halal</span>
            <span>100% Halal · Smashed Daily</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
