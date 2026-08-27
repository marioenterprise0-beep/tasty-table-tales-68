/**
 * Central registry for site photography.
 *
 * Every slot renders a branded placeholder until a real photo is set.
 * To add a photo: drop the file in /public (or src/assets) and set `src`
 * (plus optional `webp`) here — no component changes needed.
 */
import heatwave from "@/assets/heatwave.png.asset.json";
import heatwaveCombo from "@/assets/heatwave-combo.png.asset.json";
import singleSmash from "@/assets/single-smash.png.asset.json";
import doubleSmash from "@/assets/double-smash.png.asset.json";
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
    alt: "Three Gotham Halal smash burgers stacked with melted cheese",
  },
  appPhone: {
    alt: "Gotham Halal mobile app shown on a phone",
  },
  cateringTrays: {
    alt: "Gotham Halal catering trays of smash burgers and loaded fries",
  },
  cateringHero: {
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
    imageClassName: "scale-[1.24] object-[center_60%]",
  },
  "Single Smash Combo": {
    src: singleSmash.url,
    alt: "The Gotham Single Smash combo with Gotham Regular Fries and a Dirty Soda",
    imageClassName: "scale-[1.24] object-[center_60%]",
  },
  "Single Smash + Fries": {
    src: singleSmash.url,
    alt: "The Gotham Single Smash served with Gotham Regular Fries",
    imageClassName: "scale-[1.24] object-[center_60%]",
  },
  "The Gotham Double Smash": {
    src: doubleSmash.url,
    alt: "The Gotham Double Smash burger with American cheese and Gotham Sauce",
    imageClassName: "object-contain scale-[1.16] translate-y-[-2%]",
  },
  "Double Smash Combo": {
    src: doubleSmash.url,
    alt: "The Gotham Double Smash combo with Gotham Regular Fries and a Dirty Soda",
    imageClassName: "object-contain scale-[1.16] translate-y-[-2%]",
  },
  "Double Smash + Fries": {
    src: doubleSmash.url,
    alt: "The Gotham Double Smash served with Gotham Regular Fries",
    imageClassName: "object-contain scale-[1.16] translate-y-[-2%]",
  },
};

export function menuImage(name: string): ImageSlot {
  return MENU_IMAGES[name] ?? { alt: `${name} from Gotham Halal` };
}
