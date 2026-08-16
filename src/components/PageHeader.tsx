export function PageHeader({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow?: string;
  title: string;
  blurb?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-gold/20 bg-ink">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
        {eyebrow && (
          <p className="display text-gold text-xs tracking-[0.3em] mb-4">{eyebrow}</p>
        )}
        <h1 className="display text-5xl md:text-7xl leading-[0.9]">{title}</h1>
        {blurb && (
          <p className="mt-5 max-w-xl text-muted-foreground leading-relaxed">{blurb}</p>
        )}
      </div>
    </section>
  );
}
