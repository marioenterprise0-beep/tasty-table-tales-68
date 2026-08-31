import * as React from "react";
import { Instagram } from "lucide-react";

export const INSTAGRAM_URL = "https://www.instagram.com/gothamhalal/?hl=en";

/**
 * Behold.so JSON feed for @gothamhalal. Falls back to branded placeholders
 * if the feed is unreachable.
 */
const FEED_URL =
  (import.meta.env["VITE_BEHOLD_FEED_URL"] as string | undefined) ??
  "https://feeds.behold.so/VfVHJ9WOWp4vxLzhuiFn";

type Post = { id: string; permalink: string; mediaUrl: string; caption?: string };

function formatCaption(caption: string | undefined, max = 110) {
  if (!caption) return "";
  const trimmed = caption.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max).trim()}…` : trimmed;
}

export function InstagramFeed() {
  const [posts, setPosts] = React.useState<Post[] | null>(null);

  React.useEffect(() => {
    if (!FEED_URL) return;
    let cancelled = false;
    fetch(FEED_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Behold feed failed: ${r.status}`))))
      .then((data: unknown) => {
        const raw = Array.isArray(data) ? data : ((data as { posts?: unknown[] })?.posts ?? []);
        const mapped = (raw as Record<string, unknown>[]).slice(0, 6).map((p, i) => {
          const sizes = p["sizes"] as Record<string, { mediaUrl?: string }> | undefined;
          const mediaUrl =
            (p["mediaUrl"] as string | undefined) ??
            sizes?.["medium"]?.mediaUrl ??
            sizes?.["large"]?.mediaUrl ??
            sizes?.["small"]?.mediaUrl ??
            (p["thumbnailUrl"] as string | undefined) ??
            "";
          return {
            id: (p["id"] as string | undefined) ?? String(i),
            permalink: (p["permalink"] as string | undefined) ?? INSTAGRAM_URL,
            mediaUrl,
            caption: p["caption"] as string | undefined,
          };
        });
        if (!cancelled) setPosts(mapped.filter((p) => p.mediaUrl));
      })
      .catch((err) => console.error(err));
    return () => {
      cancelled = true;
    };
  }, []);

  const tiles = posts && posts.length > 0 ? posts : null;

  return (
    <section className="bg-ink" aria-labelledby="instagram-feed">
      <div className="mx-auto max-w-[1500px] px-5 py-14 md:px-10 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-gold/20 pb-5">
          <div>
            <p className="display text-[11px] tracking-[0.22em] text-gold/80 uppercase">
              Follow The Flavor
            </p>
            <h2
              id="instagram-feed"
              className="display mt-1 text-2xl tracking-[0.01em] text-gold md:text-[34px]"
            >
              Straight From The Grill
            </h2>
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="display inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/[0.03] px-4 py-2 text-[11px] tracking-[0.12em] text-white/90 transition hover:border-gold hover:bg-gold hover:text-gold-foreground"
          >
            <Instagram className="size-4" />
            @gothamhalal
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {tiles
            ? tiles.map((p, i) => {
                const caption = formatCaption(p.caption);
                return (
                  <a
                    key={p.id}
                    href={p.permalink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="View on Instagram"
                    className={`group relative aspect-square overflow-hidden rounded-xl border border-gold/15 bg-ink transition hover:border-gold/50 ${
                      i >= 4 ? "hidden lg:block" : ""
                    }`}
                  >
                    <img
                      src={p.mediaUrl}
                      alt={p.caption?.slice(0, 120) || "Gotham Halal on Instagram"}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                    <span className="absolute inset-x-0 bottom-0 flex translate-y-2 flex-col gap-1.5 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {caption && (
                        <span className="line-clamp-3 text-[13px] leading-snug text-white/95">
                          {caption}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] text-gold uppercase">
                        <Instagram className="size-3.5" />
                        View on Instagram
                      </span>
                    </span>
                  </a>
                );
              })
            : Array.from({ length: 6 }).map((_, i) => (
                <a
                  key={i}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Gotham Halal on Instagram"
                  className={`group relative aspect-square overflow-hidden rounded-xl border border-gold/15 bg-white/[0.03] transition hover:border-gold/50 ${
                    i >= 4 ? "hidden lg:block" : ""
                  }`}
                >
                  <span className="flex h-full w-full items-center justify-center">
                    <img
                      src="/gotham-halal-logo.svg"
                      alt=""
                      aria-hidden="true"
                      className="h-2/5 w-auto opacity-10 transition duration-300 group-hover:opacity-20"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}

