/**
 * Brand-level Google reviews shown on the homepage and Locations page.
 * Replace the placeholder text with real review copy — display only,
 * no rating/review structured data is emitted for these.
 */
export const GOOGLE_RATING = 4.7;
export const GOOGLE_REVIEW_COUNT = 278;

/** Google Business Profile listing + review links. */
export const GOOGLE_LISTING_URL = "https://share.google/ohN6YdYP539PDVNRa";
export const GOOGLE_REVIEW_URL = "https://share.google/ohN6YdYP539PDVNRa";

export type Review = {
  id: string;
  stars: number;
  text: string;
  author: string;
};

export const REVIEWS: Review[] = [
  {
    id: "r1",
    stars: 5,
    text: "Best smash burger in Rochester, hands down. The Gotham Sauce is unreal and knowing it's all halal makes it even better.",
    author: "Amir H.",
  },
  {
    id: "r2",
    stars: 5,
    text: "Crime Scene fries are exactly what they sound like — messy, loaded and worth every napkin. Staff were quick and friendly.",
    author: "Jasmine T.",
  },
  {
    id: "r3",
    stars: 5,
    text: "Finally a halal spot that doesn't cut corners. Fresh patties, crispy edges, and the dirty sodas are a whole vibe.",
    author: "Marcus D.",
  },
  {
    id: "r4",
    stars: 4,
    text: "The Heatwave has a real kick. Line moved fast even on a Friday night. Will be back for the Red Moon.",
    author: "Sara K.",
  },
  {
    id: "r5",
    stars: 5,
    text: "Ordered catering for our office and everyone asked where it came from. Easy to work with and everything arrived hot.",
    author: "Danielle P.",
  },
  {
    id: "r6",
    stars: 5,
    text: "Smashafel surprised me — crispy outside, soft inside. Great option when I'm skipping meat.",
    author: "Omar S.",
  },
];
