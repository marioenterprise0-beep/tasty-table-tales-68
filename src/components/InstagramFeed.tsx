import * as React from "react";
import { Instagram } from "lucide-react";

export const INSTAGRAM_URL = "https://www.instagram.com/gothamhalal/?hl=en";

/**
 * Behold.so feed JSON URL. Set VITE_BEHOLD_FEED_URL to switch the grid from
 * branded placeholders to live Instagram posts — no code change needed.
 */
const FEED_URL = import.meta.env["VITE_BEHOLD_FEED_URL"] as string | undefined;

type Post = { id: string; permalink: string; mediaUrl: string; caption?: string };

export function InstagramFeed() {
  const [posts, setPosts] = React.useState<Post[] | null>(null);

  React.useEffect(() => {
    if (!FEED_URL) return;
    let cancelled = false;
    fetch(FEED_URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Behold feed failed: ${r.status}`))))
      .then((data: unknown) => {
        const raw = Array.isArray(data) ? data : ((data as { posts?: unknown[] })?.posts ?? []);
        const mapped = (raw as Record<string, string>[]).slice(0, 6).map((p, i) => ({
          id: p["id"] ?? String(i),
          permalink: p["permalink"] ?? INSTAGRAM_URL,
          mediaUrl: p["sizes"] ? "" : (p["mediaUrl"] ?? p["thumbnailUrl"] ?? ""),
          caption: p["caption"],
        }));
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
      <div className="mx-auto max-w-[1500px] px-5 py-12 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="instagram-feed" className="display text-2xl tracking-[0.01em] text-gold md:text-[34px]">
            Straight From The Grill
          </h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="display inline-flex items-center gap-2 text-[11px] tracking-[0.16em] text-white/70 transition hover:text-gold"
          >
            <Instagram className="size-4" />
            @gothamhalal
          </a>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {tiles
            ? tiles.map((p) => (
                <a
                  key={p.id}
                  href={p.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="aspect-square overflow-hidden rounded-lg border border-gold/20"
                >
                  <img
                    src={p.mediaUrl}
                    alt={p.caption?.slice(0, 120) || "Gotham Halal on Instagram"}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </a>
              ))
            : Array.from({ length: 6 }).map((_, i) => (
                <a
                  key={i}
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Gotham Halal on Instagram"
                  className="flex aspect-square items-center justify-center rounded-lg border border-gold/20 bg-white/[0.03] transition hover:border-gold/50"
                >
                  <img
                    src="/gotham-halal-logo.svg"
                    alt=""
                    aria-hidden="true"
                    className="h-1/2 w-auto opacity-15"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ))}
        </div>
      </div>
    </section>
  );
}
