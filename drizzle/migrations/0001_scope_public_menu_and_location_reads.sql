DROP POLICY IF EXISTS "Anyone can read menu categories" ON public.menu_categories;
CREATE POLICY "Public reads active menu categories" ON public.menu_categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins read all menu categories" ON public.menu_categories FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Anyone can read menu items" ON public.menu_items;
CREATE POLICY "Public reads active dishes in active categories" ON public.menu_items FOR SELECT TO anon, authenticated USING (is_active = true AND EXISTS (SELECT 1 FROM public.menu_categories AS category WHERE category.id = menu_items.category_id AND category.is_active = true));
CREATE POLICY "Admins read all menu items" ON public.menu_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Anyone can read location settings" ON public.location_settings;
CREATE POLICY "Public reads current restaurant location settings" ON public.location_settings FOR SELECT TO anon, authenticated USING (location_slug IN ('west-ridge', 'jefferson-road'));
CREATE POLICY "Admins read all location settings" ON public.location_settings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));