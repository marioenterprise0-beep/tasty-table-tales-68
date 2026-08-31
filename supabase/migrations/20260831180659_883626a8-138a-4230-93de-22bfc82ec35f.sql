CREATE TABLE public.menu_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  order_category_slug text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.menu_categories TO authenticated;
GRANT ALL ON public.menu_categories TO service_role;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read menu categories" ON public.menu_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert menu categories" ON public.menu_categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update menu categories" ON public.menu_categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete menu categories" ON public.menu_categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.menu_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric NOT NULL,
  card_price numeric,
  is_vegetarian boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  ingredients text[] NOT NULL DEFAULT '{}',
  add_ons text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, name)
);
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read menu items" ON public.menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert menu items" ON public.menu_items FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update menu items" ON public.menu_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete menu items" ON public.menu_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.location_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_slug text NOT NULL UNIQUE,
  order_url text NOT NULL DEFAULT 'https://ordergothamhalal.com',
  is_order_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.location_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.location_settings TO authenticated;
GRANT ALL ON public.location_settings TO service_role;
ALTER TABLE public.location_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read location settings" ON public.location_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert location settings" ON public.location_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update location settings" ON public.location_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete location settings" ON public.location_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON public.menu_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_location_settings_updated_at BEFORE UPDATE ON public.location_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.menu_categories (name, display_order, order_category_slug) VALUES
  ('Gotham Burgers', 1, 'gotham-burgers'),
  ('Burger Combos', 2, NULL),
  ('Burgers with Fries', 3, NULL),
  ('Gotham Fries', 4, NULL),
  ('Healthy Options', 5, NULL),
  ('Gotham Dirty Sodas', 6, NULL);

INSERT INTO public.menu_items (category_id, name, description, price, is_featured, is_vegetarian, is_active, display_order, ingredients, add_ons)
SELECT c.id, v.name, v.description, v.price, v.is_featured, v.is_vegetarian, v.is_active, v.display_order, v.ingredients, v.add_ons
FROM public.menu_categories c
JOIN (VALUES
  ('Gotham Burgers','The Gotham Single Smash','Single smash patty, American cheese, Gotham Sauce.',10.00,true,false,true,1,'{}'::text[],'{}'::text[]),
  ('Gotham Burgers','The Gotham Double Smash','Double smash patties, American cheese, Gotham Sauce.',12.00,true,false,true,2,'{}'::text[],'{}'::text[]),
  ('Gotham Burgers','The Gotham Triple Smash','Triple smash patties, American cheese, Gotham Sauce.',15.00,false,false,true,3,'{}'::text[],'{}'::text[]),
  ('Gotham Burgers','The Gotham Heatwave','Double smash, pepperjack, jalapeños, spicy kick.',13.00,true,false,true,4,'{}'::text[],'{}'::text[]),
  ('Gotham Burgers','The Gotham Red Moon','Double smash, Hot Cheetos crunch, jalapeños.',13.00,false,false,true,5,'{}'::text[],'{}'::text[]),
  ('Burger Combos','Single Smash Combo','Served with Gotham Regular Fries + your choice of Dirty Soda.',18.00,false,false,true,1,'{}'::text[],'{}'::text[]),
  ('Burger Combos','Double Smash Combo','Served with Gotham Regular Fries + your choice of Dirty Soda.',20.00,false,false,true,2,'{}'::text[],'{}'::text[]),
  ('Burger Combos','Triple Smash Combo','Served with Gotham Regular Fries + your choice of Dirty Soda.',23.00,false,false,true,3,'{}'::text[],'{}'::text[]),
  ('Burger Combos','Heatwave Combo','Served with Gotham Regular Fries + your choice of Dirty Soda.',21.00,false,false,true,4,'{}'::text[],'{}'::text[]),
  ('Burger Combos','Red Moon Combo','Served with Gotham Regular Fries + your choice of Dirty Soda.',21.00,false,false,true,5,'{}'::text[],'{}'::text[]),
  ('Burgers with Fries','Single Smash + Fries','Burger served with Gotham Regular Fries.',13.00,false,false,true,1,'{}'::text[],'{}'::text[]),
  ('Burgers with Fries','Double Smash + Fries','Burger served with Gotham Regular Fries.',15.00,false,false,true,2,'{}'::text[],'{}'::text[]),
  ('Burgers with Fries','Triple Smash + Fries','Burger served with Gotham Regular Fries.',18.00,false,false,true,3,'{}'::text[],'{}'::text[]),
  ('Burgers with Fries','Heatwave + Fries','Burger served with Gotham Regular Fries.',16.00,false,false,true,4,'{}'::text[],'{}'::text[]),
  ('Burgers with Fries','Red Moon + Fries','Burger served with Gotham Regular Fries.',16.00,false,false,true,5,'{}'::text[],'{}'::text[]),
  ('Gotham Fries','Gotham Regular Fries','Golden fries tossed with Gotham Sauce.',6.00,false,false,true,1,'{}'::text[],'{}'::text[]),
  ('Gotham Fries','Gotham Large Fries','Golden fries tossed with Gotham Sauce.',10.00,false,false,true,2,'{}'::text[],'{}'::text[]),
  ('Gotham Fries','Signal Cheese Fries','Melted cheese + a drizzle of Gotham Sauce.',8.00,false,false,true,3,'{}'::text[],'{}'::text[]),
  ('Gotham Fries','Crime Scene','Cheese fries, seasoned beef, beef bacon, jalapeños.',13.00,true,false,true,4,'{}'::text[],'{}'::text[]),
  ('Gotham Fries','Gotham Loaded Fries','Details coming soon.',0.00,false,false,false,5,'{}'::text[],'{}'::text[]),
  ('Gotham Fries','Bag of Chips','Details coming soon.',0.00,false,false,false,6,'{}'::text[],'{}'::text[]),
  ('Healthy Options','Smashafel','Crispy smashed falafel patties on a toasted bun with Gotham sauce.',8.00,false,true,true,1,ARRAY['Smashed falafel patty','Toasted bun','Lettuce','Tomatoes','Pickles','Onions','Gotham Sauce'],ARRAY['Add Gotham Regular Fries','Extra Gotham Sauce','Add jalapeños']),
  ('Healthy Options','The Clean Getaway','Lettuce wrapped smashed patties with American cheese and Gotham Sauce.',12.00,false,false,true,2,ARRAY['Smashed beef patties','American cheese','Gotham Sauce','Lettuce wrap'],ARRAY['Add an extra patty','Add jalapeños','Extra Gotham Sauce']),
  ('Gotham Dirty Sodas','Strawberry Siren','Sweet strawberry with a smooth, creamy finish.',6.00,false,false,true,1,'{}'::text[],'{}'::text[]),
  ('Gotham Dirty Sodas','Watermelon Phantom','Light, refreshing watermelon, clean finish.',6.00,false,false,true,2,'{}'::text[],'{}'::text[]),
  ('Gotham Dirty Sodas','Peach District','Juicy peach with a smooth, mellow finish.',6.00,false,false,true,3,'{}'::text[],'{}'::text[]),
  ('Gotham Dirty Sodas','Blue Nightfall','Cool blue citrus, made for Gotham nights.',6.00,false,false,true,4,'{}'::text[],'{}'::text[]),
  ('Gotham Dirty Sodas','Pineapple Pulse','Bright pineapple with a bold tropical punch.',6.00,false,false,true,5,'{}'::text[],'{}'::text[]),
  ('Gotham Dirty Sodas','Mango Mirage','Tropical mango with a rich, silky sweetness.',6.00,false,false,true,6,'{}'::text[],'{}'::text[]),
  ('Gotham Dirty Sodas','Green Voltage','Electric green apple with a bold bite.',6.00,false,false,true,7,'{}'::text[],'{}'::text[])
) AS v(category_name, name, description, price, is_featured, is_vegetarian, is_active, display_order, ingredients, add_ons)
ON c.name = v.category_name;

INSERT INTO public.location_settings (location_slug, order_url, is_order_enabled) VALUES
  ('west-ridge', 'https://ordergothamhalal.com', true),
  ('jefferson-road', 'https://ordergothamhalal.com', false);