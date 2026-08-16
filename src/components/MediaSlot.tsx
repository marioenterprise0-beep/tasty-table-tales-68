import { ImageIcon } from "lucide-react";

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
  tone = "dark",
  className = "",
}: {
  label?: string;
  ratio?: Ratio;
  tone?: "dark" | "gold";
  className?: string;
}) {
  const toneClasses =
    tone === "gold"
      ? "bg-gold/15 border-gold-foreground/35 text-gold-foreground"
      : "bg-ink/70 border-gold/35 text-gold";

  return (
    <div
      className={`relative w-full ${RATIOS[ratio]} rounded-2xl border border-dashed ${toneClasses} overflow-hidden flex items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center gap-3 opacity-70 px-4 text-center">
        <ImageIcon className="w-9 h-9 md:w-10 md:h-10" strokeWidth={1.25} />
        {label && (
          <span className="display text-[10px] md:text-[11px] tracking-[0.28em]">{label}</span>
        )}
      </div>
    </div>
  );
}
