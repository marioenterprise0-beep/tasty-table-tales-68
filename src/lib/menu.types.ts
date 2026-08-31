/** Client-safe shapes shared by the public menu read and the menu page. */
export type PublicMenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string;
  cardPrice: string | null;
  isVegetarian: boolean;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  ingredients: string[];
  addOns: string[];
};

export type PublicMenuCategory = {
  id: string;
  name: string;
  orderCategorySlug: string | null;
  displayOrder: number;
};

export type PublicMenu = {
  categories: PublicMenuCategory[];
  items: PublicMenuItem[];
};

export type LocationSettingRow = {
  location_slug: string;
  order_url: string;
  is_order_enabled: boolean;
};
