export function SiteFooter() {
  return (
    <footer className="mt-16 px-3 md:px-6 pb-6">
      <div className="mx-auto max-w-[1400px] rounded-3xl bg-nav text-nav-foreground px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <img src="/gotham-halal-logo.svg" alt="Gotham Halal" className="h-14 w-auto" />
          <p className="text-xs uppercase tracking-[0.2em] text-nav-foreground/70">
            © {new Date().getFullYear()} Gotham Halal · 100% Halal
          </p>
        </div>
      </div>
    </footer>
  );
}
