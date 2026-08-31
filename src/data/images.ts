/**
 * Central registry for site photography.
 *
 * Every slot renders a branded placeholder until a real photo is set.
 * To add a photo: drop the file in /public (or src/assets) and set `src`
 * (plus optional `webp`) here — no component changes needed.
 */
import heatwave from "@/assets/heatwave.png.asset.json";
import heatwaveCombo from "@/assets/heatwave-combo.png.asset.json";
import singleSmash from "@/assets/single-smash-v2.png.asset.json";
import doubleSmash from "@/assets/double-smash-v2.png.asset.json";
import heroBurgers from "@/assets/hero-burgers.webp.asset.json";
import cateringBurgers from "@/assets/catering-burgers.png.asset.json";
import appPhone from "@/assets/app-phone.jpg.asset.json";
export type ImageSlot = {
  /** Fallback source (jpg/png). Leave empty to render the branded placeholder. */
  src?: string;
  /** Optional .webp source served first via <picture>. */
  webp?: string;
  alt: string;
  /** Optional crop adjustment used to keep differently framed photos consistent. */
  imageClassName?: string;
};

export const IMAGES = {
  heroBurgers: {
    src: heroBurgers.url,
    alt: "Four Gotham Halal smash burgers and loaded fries piled together",
  },
  appPhone: {
    alt: "Gotham Halal mobile app shown on a phone",
  },
  cateringTrays: {
    src: cateringBurgers.url,
    alt: "Gotham Halal catering trays of smash burgers and loaded fries",
  },
  cateringHero: {
    src: cateringBurgers.url,
    alt: "Gotham Halal catering spread for an event",
  },
  ourStory: {
    alt: "The Gotham Halal team behind the counter in Rochester, NY",
  },
} satisfies Record<string, ImageSlot>;

/** Photos per menu item, keyed by item name. */
export const MENU_IMAGES: Record<string, ImageSlot> = {
  "The Gotham Heatwave": {
    src: heatwave.url,
    alt: "The Gotham Heatwave smash burger with jalapeños and melted pepperjack",
  },
  "Heatwave Combo": {
    src: heatwaveCombo.url,
    alt: "The Gotham Heatwave combo with Gotham Regular Fries and a Dirty Soda",
  },
  "Heatwave + Fries": {
    src: heatwaveCombo.url,
    alt: "The Gotham Heatwave served with Gotham Regular Fries",
  },
  "The Gotham Single Smash": {
    src: singleSmash.url,
    alt: "The Gotham Single Smash burger with American cheese and Gotham Sauce",
  },
  "Single Smash Combo": {
    src: singleSmash.url,
    alt: "The Gotham Single Smash combo with Gotham Regular Fries and a Dirty Soda",
  },
  "Single Smash + Fries": {
    src: singleSmash.url,
    alt: "The Gotham Single Smash served with Gotham Regular Fries",
  },
  "The Gotham Double Smash": {
    src: doubleSmash.url,
    alt: "The Gotham Double Smash burger with American cheese and Gotham Sauce",
  },
  "Double Smash Combo": {
    src: doubleSmash.url,
    alt: "The Gotham Double Smash combo with Gotham Regular Fries and a Dirty Soda",
  },
  "Double Smash + Fries": {
    src: doubleSmash.url,
    alt: "The Gotham Double Smash served with Gotham Regular Fries",
  },
};

export function menuImage(name: string): ImageSlot {
  return MENU_IMAGES[name] ?? { alt: `${name} from Gotham Halal` };
}
