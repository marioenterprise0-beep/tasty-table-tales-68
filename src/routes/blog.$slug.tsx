import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BrandImage } from "@/components/BrandImage";
import { BLOG_POSTS, formatPostDate, getPost } from "@/data/blog";
import { IMAGES } from "@/data/images";
import { ORDER_URL } from "@/lib/order";

const SITE = "https://tasty-table-tales-68.lovable.app";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Post Not Found — Gotham Halal" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    const url = `/blog/${params.slug}`;
    return {
      meta: [
        { title: `${post.title} — Gotham Halal` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.date },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}${url}` },
            author: { "@type": "Organization", name: "Gotham Halal" },
            publisher: { "@type": "Organization", name: "Gotham Halal" },
          }),
        },
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPostPage;
});

function PostNotFound() {
  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-2xl px-5 py-20 text-center md:px-10">
        <h1 className="display text-3xl text-gold">Post Not Found</h1>
        <p className="mt-4 text-white/75">That story isn&apos;t here. Try the blog index.</p>
        <Link
          to="/blog"
          className="display mt-6 inline-flex rounded-full border border-gold/50 px-6 py-3 text-[11px] tracking-[0.14em] text-gold transition hover:bg-gold hover:text-gold-foreground"
        >
          Back to Blog
        </Link>
      </div>
    </section>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const more = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <article className="bg-ink">
        <div className="mx-auto max-w-3xl px-5 py-12 md:px-10">
          <Link to="/blog" className="display text-[11px] tracking-[0.18em] text-gold hover:underline">
            ← Blog
          </Link>
          <h1 className="display mt-4 text-[2.25rem] leading-[0.95] tracking-[-0.02em] text-white sm:text-[3rem]">
            {post.title}
          </h1>
          <time dateTime={post.date} className="mt-3 block text-sm text-white/60">
            {formatPostDate(post.date)}
          </time>

          <BrandImage slot={IMAGES.heroBurgers} className="mt-8 aspect-[16/9]" />

          <div className="mt-8 space-y-5">
            {post.body.map((block) =>
              block.startsWith("## ") ? (
                <h2 key={block} className="display pt-3 text-[20px] leading-tight text-gold">
                  {block.slice(3)}
                </h2>
              ) : (
                <p key={block} className="text-[16px] leading-relaxed text-white/85">
                  {block}
                </p>
              ),
            )}
          </div>

          <div className="mt-12 rounded-2xl border border-gold/25 bg-white/[0.03] p-7 text-center">
            <h2 className="display text-[22px] leading-tight text-white">
              Hungry <span className="text-gold">Yet?</span>
            </h2>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/menu" className="display rounded-full border border-gold/50 px-7 py-3 text-[11px] tracking-[0.14em] text-gold transition hover:bg-gold hover:text-gold-foreground">
                See the Menu
              </Link>
              <a href={ORDER_URL} target="_blank" rel="noopener noreferrer" className="pill-gold px-7 py-3 text-[11px]">
                Order Now
              </a>
            </div>
          </div>

          {more.length > 0 && (
            <div className="mt-12 border-t border-gold/15 pt-8">
              <h2 className="display text-[12px] tracking-[0.2em] text-gold">More Reading</h2>
              <ul className="mt-4 space-y-3">
                {more.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="text-white/80 transition hover:text-gold"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
