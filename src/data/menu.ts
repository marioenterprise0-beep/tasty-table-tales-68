export type MenuDish = {
  name: string;
  copy: string;
  section: string;
};

export const MENU_DISHES: MenuDish[] = [
  {
    section: "Smash Burgers",
    name: "Gotham Single Smash",
    copy: "Single beef patty, American cheese, caramelized onions, pickles, Gotham Sauce, sesame bun.",
  },
  {
    section: "Smash Burgers",
    name: "Heatwave Double Smash",
    copy: "Double smash patties, pepper jack cheese, jalapeños, spicy aioli, pickles, sesame bun.",
  },
  {
    section: "Smash Burgers",
    name: "Red Moon Smash Burger",
    copy: "Double smash patties, hot Cheeto crunch, pepper jack cheese, pickled jalapeños, Red Moon sauce, sesame bun.",
  },
  {
    section: "Loaded Fries",
    name: "Crime Scene Fries",
    copy: "Fries loaded with beef bacon, jalapeños, cheese sauce, ranch drizzle, chopped Gotham Sauce.",
  },
];

export const MENU_SECTIONS = Array.from(new Set(MENU_DISHES.map((d) => d.section)));

export const menuJsonLd = {
  "@context": "https://schema.org",
  "@type": "Menu",
  name: "Gotham Halal Menu",
  url: "/menu",
  inLanguage: "en-US",
  hasMenuSection: MENU_SECTIONS.map((section) => ({
    "@type": "MenuSection",
    name: section,
    hasMenuItem: MENU_DISHES.filter((d) => d.section === section).map((d) => ({
      "@type": "MenuItem",
      name: d.name,
      description: d.copy,
      suitableForDiet: "https://schema.org/HalalDiet",
    })),
  })),
};
