import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandImage } from "@/components/BrandImage";
import { BLOG_POSTS, formatPostDate } from "@/data/blog";
import { IMAGES } from "@/data/images";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — Gotham Halal Rochester" },
      { name: "description", content: "Halal food, late-night eats and Rochester restaurant stories from the crew behind Gotham Halal smash burgers." },
      { property: "og:title", content: "Blog — Gotham Halal" },
      { property: "og:description", content: "Halal food, late-night eats and Rochester stories from Gotham Halal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <section className="bg-ink">
        <div className="mx-auto max-w-[1500px] px-5 py-12 md:px-10">
          <p className="display text-[11px] tracking-[0.24em] text-gold">From the counter</p>
          <h1 className="display mt-3 text-[2.5rem] leading-[0.9] tracking-[-0.02em] text-white sm:text-[3.25rem]">
            The <span className="text-gold">Blog</span>
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-snug text-white/85">
            Halal done right, late-night Rochester and how this thing got built.
          </p>
        </div>
      </section>

      <section className="border-t border-gold/15 bg-ink">
        <div className="mx-auto grid max-w-[1500px] gap-6 px-5 pb-16 pt-10 md:grid-cols-2 md:px-10 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white/[0.03]"
            >
              <BrandImage slot={IMAGES.heroBurgers} className="aspect-[16/10] rounded-none border-0" />
              <div className="flex flex-1 flex-col p-6">
                <time dateTime={post.date} className="display text-[11px] tracking-[0.18em] text-gold">
                  {formatPostDate(post.date)}
                </time>
                <h2 className="display mt-3 text-[20px] leading-[1.05] text-white">{post.title}</h2>
                <p className="mt-3 flex-1 text-[14px] leading-snug text-white/75">{post.excerpt}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="display mt-5 inline-flex w-fit items-center rounded-full border border-gold/50 px-5 py-2 text-[11px] tracking-[0.14em] text-gold transition hover:bg-gold hover:text-gold-foreground"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
