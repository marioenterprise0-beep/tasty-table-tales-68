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
  fill = false,
  className = "",
}: {
  label?: string;
  ratio?: Ratio;
  tone?: "dark" | "gold";
  /** Fill the parent instead of holding an aspect ratio. */
  fill?: boolean;
  className?: string;
}) {
  const toneClasses =
    tone === "gold"
      ? "border-gold-foreground/30 text-gold-foreground/70"
      : "border-gold/30 text-gold/70";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border border-dashed ${toneClasses} ${
        fill ? "w-full h-full" : `w-full ${RATIOS[ratio]}`
      } ${className}`}
    >
      <div className="flex flex-col items-center gap-2 px-4 text-center">
        <ImageIcon className="w-7 h-7" strokeWidth={1.25} />
        {label && (
          <span className="display text-[9px] tracking-[0.24em] leading-relaxed">{label}</span>
        )}
      </div>
    </div>
  );
}
