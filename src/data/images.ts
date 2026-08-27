/**
 * Central registry for site photography.
 *
 * Every slot renders a branded placeholder until a real photo is set.
 * To add a photo: drop the file in /public (or src/assets) and set `src`
 * (plus optional `webp`) here — no component changes needed.
 */
import heatwave from "@/assets/heatwave.png.asset.json";
import heatwaveCombo from "@/assets/heatwave-combo.png.asset.json";
export type ImageSlot = {
  /** Fallback source (jpg/png). Leave empty to render the branded placeholder. */
  src?: string;
  /** Optional .webp source served first via <picture>. */
  webp?: string;
  alt: string;
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
};

export function menuImage(name: string): ImageSlot {
  return MENU_IMAGES[name] ?? { alt: `${name} from Gotham Halal` };
}
