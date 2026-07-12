import type { ReactNode } from "react";

type MediaSlotProps = {
  label: string;
  ratio?: "square" | "portrait" | "wide";
  icon?: ReactNode;
  className?: string;
};

const RATIO: Record<NonNullable<MediaSlotProps["ratio"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[16/10]",
};

export function MediaSlot({ label, ratio = "square", icon, className = "" }: MediaSlotProps) {
  return (
    <div
      className={`${RATIO[ratio]} w-full rounded-md border border-dashed border-primary/40 bg-secondary/40 flex flex-col items-center justify-center gap-3 text-primary/70 ${className}`}
    >
      <div className="text-3xl opacity-80">{icon ?? "▲"}</div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-primary/60">
        {label}
      </div>
    </div>
  );
}
