type Ratio = "square" | "wide" | "portrait";

export function MediaSlot({
  label,
  ratio = "square",
  icon = "🍔",
  tone = "yellow",
}: {
  label?: string;
  ratio?: Ratio;
  icon?: string;
  tone?: "yellow" | "dark";
}) {
  const aspect =
    ratio === "wide" ? "aspect-[16/10]" : ratio === "portrait" ? "aspect-[3/4]" : "aspect-square";

  const toneClasses =
    tone === "dark"
      ? "bg-nav/95 text-nav-foreground border-nav-foreground/25"
      : "bg-background text-foreground border-foreground/25";

  return (
    <div
      className={`relative w-full ${aspect} rounded-3xl border-2 border-dashed ${toneClasses} overflow-hidden flex items-center justify-center`}
    >
      <div className="flex flex-col items-center gap-2 opacity-80">
        <span className="text-5xl md:text-6xl leading-none">{icon}</span>
        {label && (
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-center px-4">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
