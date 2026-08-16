type Ratio = "square" | "wide" | "portrait" | "card" | "phone";

const RATIOS: Record<Ratio, string> = {
  square: "aspect-square",
  wide: "aspect-[16/9]",
  portrait: "aspect-[3/4]",
  card: "aspect-[4/3]",
  phone: "aspect-[9/19]",
};

export function MediaSlot({
  label,
  ratio = "card",
  icon = "🍔",
  tone = "dark",
  className = "",
}: {
  label?: string;
  ratio?: Ratio;
  icon?: string;
  tone?: "dark" | "gold";
  className?: string;
}) {
  const toneClasses =
    tone === "gold"
      ? "bg-gold/15 border-ink/30 text-ink"
      : "bg-ink/70 border-gold/35 text-gold";

  return (
    <div
      className={`relative w-full ${RATIOS[ratio]} rounded-2xl border border-dashed ${toneClasses} overflow-hidden flex items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center gap-2 opacity-70 px-4 text-center">
        <span className="text-4xl md:text-5xl leading-none">{icon}</span>
        {label && (
          <span className="display text-[10px] md:text-[11px] tracking-[0.28em]">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
