export type MenuDish = {
  name: string;
  copy: string;
  price: string;
  section: string;
  featured?: boolean;
  /** Explicit ingredient list shown in the item details modal. */
  ingredients?: string[];
  /** Combo / add-on options shown in the item details modal. */
  addOns?: string[];
};

/** Standard add-on options available on every burger. */
export const BURGER_ADD_ONS = [
  "Make it a combo — Gotham Regular Fries + Dirty Soda",
  "Add Gotham Regular Fries",
  "Extra American cheese",
  "Add jalapeños",
  "Extra Gotham Sauce",
];

export const MENU_DISHES: MenuDish[] = [
  // ---- Gotham Burgers ----
  {
    section: "Gotham Burgers",
    name: "The Gotham Single Smash",
    copy: "Single smash patty, American cheese, Gotham Sauce.",
    price: "10.00",
    featured: true,
  },
  {
    section: "Gotham Burgers",
    name: "The Gotham Double Smash",
    copy: "Double smash patties, American cheese, Gotham Sauce.",
    price: "12.00",
    featured: true,
  },
  {
    section: "Gotham Burgers",
    name: "The Gotham Triple Smash",
    copy: "Triple smash patties, American cheese, Gotham Sauce.",
    price: "15.00",
  },
  {
    section: "Gotham Burgers",
    name: "The Gotham Heatwave",
    copy: "Double smash, pepperjack, jalapeños, spicy kick.",
    price: "13.00",
    featured: true,
  },
  {
    section: "Gotham Burgers",
    name: "The Gotham Red Moon",
    copy: "Double smash, Hot Cheetos crunch, jalapeños.",
    price: "13.00",
  },

  // ---- Burger Combos ----
  {
    section: "Burger Combos",
    name: "Single Smash Combo",
    copy: "Served with Gotham Regular Fries + your choice of Dirty Soda.",
    price: "18.00",
  },
  {
    section: "Burger Combos",
    name: "Double Smash Combo",
    copy: "Served with Gotham Regular Fries + your choice of Dirty Soda.",
    price: "20.00",
  },
  {
    section: "Burger Combos",
    name: "Triple Smash Combo",
    copy: "Served with Gotham Regular Fries + your choice of Dirty Soda.",
    price: "23.00",
  },
  {
    section: "Burger Combos",
    name: "Heatwave Combo",
    copy: "Served with Gotham Regular Fries + your choice of Dirty Soda.",
    price: "21.00",
  },
  {
    section: "Burger Combos",
    name: "Red Moon Combo",
    copy: "Served with Gotham Regular Fries + your choice of Dirty Soda.",
    price: "21.00",
  },

  // ---- Burgers with Fries ----
  { section: "Burgers with Fries", name: "Single Smash + Fries", copy: "Burger served with Gotham Regular Fries.", price: "13.00" },
  { section: "Burgers with Fries", name: "Double Smash + Fries", copy: "Burger served with Gotham Regular Fries.", price: "15.00" },
  { section: "Burgers with Fries", name: "Triple Smash + Fries", copy: "Burger served with Gotham Regular Fries.", price: "18.00" },
  { section: "Burgers with Fries", name: "Heatwave + Fries", copy: "Burger served with Gotham Regular Fries.", price: "16.00" },
  { section: "Burgers with Fries", name: "Red Moon + Fries", copy: "Burger served with Gotham Regular Fries.", price: "16.00" },

  // ---- Gotham Fries ----
  {
    section: "Gotham Fries",
    name: "Gotham Regular Fries",
    copy: "Golden fries tossed with Gotham Sauce.",
    price: "6.00",
  },
  {
    section: "Gotham Fries",
    name: "Gotham Large Fries",
    copy: "Golden fries tossed with Gotham Sauce.",
    price: "10.00",
  },
  {
    section: "Gotham Fries",
    name: "Signal Cheese Fries",
    copy: "Melted cheese + a drizzle of Gotham Sauce.",
    price: "8.00",
  },
  {
    section: "Gotham Fries",
    name: "Crime Scene",
    copy: "Cheese fries, seasoned beef, beef bacon, jalapeños.",
    price: "13.00",
    featured: true,
  },

  // ---- Healthy Options ----
  {
    section: "Healthy Options",
    name: "Smashafel (Vegetarian)",
    copy: "Crispy smashed falafel on a toasted bun with lettuce, tomatoes, pickles, onions + Gotham Sauce.",
    price: "8.00",
    ingredients: ["Smashed falafel patty", "Toasted bun", "Lettuce", "Tomatoes", "Pickles", "Onions", "Gotham Sauce"],
    addOns: ["Add Gotham Regular Fries", "Extra Gotham Sauce", "Add jalapeños"],
  },
  {
    section: "Healthy Options",
    name: "The Clean Getaway",
    copy: "Lettuce wrapped smashed patties with American cheese and Gotham Sauce.",
    price: "12.00",
    ingredients: ["Smashed beef patties", "American cheese", "Gotham Sauce", "Lettuce wrap"],
    addOns: ["Add an extra patty", "Add jalapeños", "Extra Gotham Sauce"],
  },


  // ---- Gotham Dirty Sodas ----
  { section: "Gotham Dirty Sodas", name: "Strawberry Siren", copy: "Sweet strawberry with a smooth, creamy finish.", price: "6.00" },
  { section: "Gotham Dirty Sodas", name: "Watermelon Phantom", copy: "Light, refreshing watermelon, clean finish.", price: "6.00" },
  { section: "Gotham Dirty Sodas", name: "Peach District", copy: "Juicy peach with a smooth, mellow finish.", price: "6.00" },
  { section: "Gotham Dirty Sodas", name: "Blue Nightfall", copy: "Cool blue citrus, made for Gotham nights.", price: "6.00" },
  { section: "Gotham Dirty Sodas", name: "Pineapple Pulse", copy: "Bright pineapple with a bold tropical punch.", price: "6.00" },
  { section: "Gotham Dirty Sodas", name: "Mango Mirage", copy: "Tropical mango with a rich, silky sweetness.", price: "6.00" },
  { section: "Gotham Dirty Sodas", name: "Green Voltage", copy: "Electric green apple with a bold bite.", price: "6.00" },
];

export const MENU_SECTIONS = Array.from(new Set(MENU_DISHES.map((d) => d.section)));

export const MENU_SPECIALS = "Specials: 5 Double Smash $50 | 10 for $100";

export const FEATURED_DISHES = MENU_DISHES.filter((d) => d.featured);

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
      offers: {
        "@type": "Offer",
        price: d.price,
        priceCurrency: "USD",
      },
    })),
  })),
};
