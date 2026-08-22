import { Star } from "lucide-react";
import { GOOGLE_LISTING_URL, GOOGLE_RATING, GOOGLE_REVIEW_COUNT, GOOGLE_REVIEW_URL, REVIEWS } from "@/data/reviews";

function Stars({ value, className = "size-4" }: { value: number; className?: string }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.min(1, Math.max(0, value - i));
        return (
          <span key={i} className="relative inline-flex">
            <Star className={`${className} text-gold-foreground/25`} strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={`${className} fill-gold text-gold`} strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

function GoogleGlyph({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.66 4.1-5.35 4.1a5.9 5.9 0 1 1 0-11.8c1.68 0 2.81.72 3.46 1.34l2.36-2.27C16.3 3.97 14.35 3.1 12 3.1a8.9 8.9 0 1 0 0 17.8c5.14 0 8.54-3.61 8.54-8.7 0-.58-.06-1.03-.19-1.1Z"
      />
    </svg>
  );
}

export function GoogleReviews() {
  return (
    <section className="bg-gold py-12" aria-labelledby="what-rochester-says">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="flex flex-col items-center gap-5 text-center">
          <h2
            id="what-rochester-says"
            className="display text-3xl tracking-[-0.01em] text-gold-foreground md:text-[42px]"
          >
            What Rochester Says
          </h2>

          <a
            href={GOOGLE_LISTING_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-4 rounded-2xl bg-ink px-6 py-4 transition hover:brightness-125"
          >
            <span className="display text-4xl leading-none text-gold">{GOOGLE_RATING}</span>
            <span className="text-left">
              <Stars value={4.5} className="size-4" />
              <span className="mt-1 block text-[12px] text-white/70">
                {GOOGLE_REVIEW_COUNT} Google Reviews
              </span>
            </span>
          </a>
        </div>

        <ul className="mt-9 -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
          {REVIEWS.map((r) => (
            <li
              key={r.id}
              className="flex w-[85%] shrink-0 snap-start flex-col rounded-2xl bg-ink p-6 sm:w-[60%] lg:w-[calc((100%-2rem)/3)]"
            >
              <Stars value={r.stars} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/85">“{r.text}”</p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="display text-[11px] tracking-[0.14em] text-gold">{r.author}</span>
                <GoogleGlyph className="size-4 text-white/50" />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex justify-center">
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noreferrer"
            className="display inline-flex h-11 items-center justify-center rounded-full border-[1.5px] border-gold-foreground px-8 text-[11px] tracking-[0.14em] text-gold-foreground transition hover:bg-gold-foreground hover:text-gold"
          >
            Leave a Review
          </a>
        </div>
      </div>
    </section>
  );
}
