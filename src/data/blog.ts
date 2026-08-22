/**
 * Blog posts. Add a new entry here and the index, post page, JSON-LD and
 * sitemap all pick it up — no layout code to touch.
 */
export interface BlogPost {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  excerpt: string;
  description: string;
  /** Paragraphs and headings. A string starting with "## " renders as a heading. */
  body: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "what-makes-a-burger-actually-halal",
    title: "What Makes a Burger Actually Halal?",
    date: "2026-01-12",
    excerpt:
      "Halal is more than a sticker on the door. Here's what it actually takes for a smash burger to be halal from the farm to your tray.",
    description:
      "What makes a burger halal — sourcing, slaughter, cross-contact and certification, explained by a Rochester halal smash burger shop.",
    body: [
      "People ask us this every week, usually while they're already halfway through a double. Fair question — \"halal\" gets printed on a lot of windows in Rochester, and it doesn't always mean the same thing.",
      "## It starts with the meat, not the menu",
      "Halal beef comes from animals raised and slaughtered under specific conditions: a healthy animal, a clean cut, and the name of God invoked at slaughter. Every pound of beef we grind traces back to a certified halal supplier. No blends, no exceptions.",
      "## Cross-contact is the part people miss",
      "A kitchen can buy halal beef and still serve something that isn't. If the same fryer runs non-halal product, or the same tongs move between trays, the line breaks. Our kitchen is 100% halal — there's no non-halal product in the building, so there's nothing to cross.",
      "## Certification is the receipt",
      "Certification means an outside body verified the chain instead of us just telling you about it. Ask any halal spot for theirs. If the answer gets vague, that's your answer.",
      "That's the whole standard we hold ourselves to, and it's why the smash burger you get from us tastes like a smash burger — not a compromise.",
    ],
  },
  {
    slug: "best-late-night-food-in-rochester",
    title: "The Best Late-Night Food in Rochester",
    date: "2026-02-02",
    excerpt:
      "Rochester after midnight is a different city. Here's how to eat well when the kitchens start closing.",
    description:
      "A guide to late-night eating in Rochester, NY — what's still open after midnight and where to get halal smash burgers late.",
    body: [
      "Rochester is a late city. Shift workers, students coming off a study session, drivers finishing a run — there's always someone looking for real food at an hour when most kitchens have already hosed down the line.",
      "## What late-night food should actually do",
      "It should be hot, it should be fast, and it should be worth the drive. A smash burger works late because it cooks in minutes and eats well in a car.",
      "## Know your hours before you go",
      "Half the late-night frustration in this city is showing up at a place that closed its kitchen an hour before the sign says. Check hours before you drive. Ours are on the locations page and we keep them current.",
      "## Where we fit",
      "We run late on West Ridge, and the Jefferson Road location is on the way. Halal, cooked to order, no heat lamp.",
      "If you're out past midnight in Rochester, you've got fewer options than you think — but they're good ones.",
    ],
  },
  {
    slug: "why-we-started-gotham-halal",
    title: "Why We Started Gotham Halal",
    date: "2026-02-20",
    excerpt:
      "We wanted one thing: a halal burger you'd choose even if it weren't halal. That turned into a restaurant.",
    description:
      "The story behind Gotham Halal — why a Rochester family started a 100% halal smash burger shop and what we're building next.",
    body: [
      "For a long time, eating halal in Rochester meant settling. You could find halal food, but rarely the food you actually wanted that night.",
      "## The gap we kept running into",
      "Burgers were the clearest example. There were great burgers in this city, and there was halal food in this city, and those two lists barely overlapped.",
      "## What we set out to build",
      "A smash burger shop that happens to be entirely halal — not a halal restaurant that also does burgers. Same standard for the crust on the patty, the seasoning, the sauce and the fries as any burger spot people line up for.",
      "## What's next",
      "A second Rochester location, more hours, and a crew that grows with us. Same beef, same standard, more places to get it.",
      "Thanks for eating with us. It's a family thing, and this city made it work.",
    ],
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
