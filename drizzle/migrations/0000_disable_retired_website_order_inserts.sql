DROP POLICY IF EXISTS "Anyone can place an order" ON public.orders;
REVOKE INSERT ON public.orders FROM anon, authenticated;
COMMENT ON TABLE public.orders IS 'DEPRECATED for new pickup orders: customers order through the external POS. Existing records remain available under existing admin policies.';