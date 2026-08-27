import type { ImageSlot } from "@/data/images";

type Props = {
  slot: ImageSlot;
  /** Tailwind aspect/size classes for the frame, e.g. "aspect-square". */
  className?: string;
  /** Fill the parent instead of holding an aspect ratio. */
  fill?: boolean;
  /** Above-the-fold images load eagerly. */
  priority?: boolean;
  /** Placeholder tone for gold sections. */
  tone?: "dark" | "gold";
  /** Skip the placeholder's solid background (for use over artwork). */
  transparentPlaceholder?: boolean;
};

/**
 * Renders a real photo when one is registered in src/data/images.ts,
 * otherwise a branded placeholder. Drop-in ready: set `src`/`webp`
 * in the data file and the photo appears everywhere that slot is used.
 */
export function BrandImage({
  slot,
  className = "",
  fill = false,
  priority = false,
  tone = "dark",
  transparentPlaceholder = false,
}: Props) {
  const frame = `relative overflow-hidden ${fill ? "h-full w-full" : "w-full"} ${className}`;

  if (!slot.src) {
    const border = tone === "gold" ? "border-gold-foreground/25" : "border-gold/25";
    const bg = transparentPlaceholder
      ? ""
      : "bg-placeholder bg-gradient-to-br from-placeholder to-ink";
    return (
      <div
        className={`${frame} flex items-center justify-center rounded-lg border ${bg} ${border}`}
        role="img"
        aria-label={slot.alt}
      >
        <img
          src="/gotham-halal-logo.svg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-contain p-6 opacity-15"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <picture className={frame}>
      {slot.webp && <source srcSet={slot.webp} type="image/webp" />}
      <img
        src={slot.src}
        alt={slot.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className="h-full w-full rounded-lg object-cover"
      />
    </picture>
  );
}
