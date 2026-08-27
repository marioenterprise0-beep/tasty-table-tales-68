-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Shared updated_at trigger fn
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Customers
CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  phone text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  email text,
  birthday_month smallint,
  birthday_day smallint,
  sms_opt_in boolean NOT NULL DEFAULT false,
  email_opt_in boolean NOT NULL DEFAULT false,
  sms_consent_timestamp timestamptz,
  sms_consent_ip text,
  email_consent_timestamp timestamptz,
  email_consent_ip text,
  phone_verified boolean NOT NULL DEFAULT false,
  pos_loyalty_linked boolean NOT NULL DEFAULT false,
  signup_source text NOT NULL DEFAULT 'account',
  unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_sign_in_at timestamptz
);
GRANT SELECT, UPDATE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers read own record" ON public.customers FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Customers update own record" ON public.customers FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX customers_email_idx ON public.customers (lower(email));
CREATE UNIQUE INDEX customers_unsubscribe_token_idx ON public.customers (unsubscribe_token);

-- Immutable consent history
CREATE TABLE public.consent_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  phone text,
  email text,
  channel text NOT NULL,
  action text NOT NULL,
  source text,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.consent_events TO service_role;
ALTER TABLE public.consent_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read consent events" ON public.consent_events FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Suppression list
CREATE TABLE public.suppression_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL,
  value text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (channel, value)
);
GRANT ALL ON public.suppression_list TO service_role;
ALTER TABLE public.suppression_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read suppression list" ON public.suppression_list FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Phone normalizer (E.164, US default)
CREATE OR REPLACE FUNCTION public.normalize_phone(_phone text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN _phone IS NULL THEN NULL
    WHEN length(regexp_replace(_phone, '\D', '', 'g')) = 10 THEN '+1' || regexp_replace(_phone, '\D', '', 'g')
    WHEN length(regexp_replace(_phone, '\D', '', 'g')) = 11 AND left(regexp_replace(_phone, '\D', '', 'g'), 1) = '1'
      THEN '+' || regexp_replace(_phone, '\D', '', 'g')
    ELSE '+' || regexp_replace(_phone, '\D', '', 'g')
  END
$$;

-- Migrate existing signups (dedupe on normalized phone, keep earliest row)
INSERT INTO public.customers (phone, first_name, email, sms_opt_in, sms_consent_timestamp, signup_source, created_at)
SELECT DISTINCT ON (public.normalize_phone(s.phone))
  public.normalize_phone(s.phone),
  nullif(trim(s.first_name), ''),
  nullif(trim(s.email), ''),
  s.sms_opt_in,
  CASE WHEN s.sms_opt_in THEN s.created_at ELSE NULL END,
  coalesce(s.signup_source, 'opening_day'),
  s.created_at
FROM public.opening_signups s
WHERE public.normalize_phone(s.phone) IS NOT NULL
ORDER BY public.normalize_phone(s.phone), s.created_at ASC
ON CONFLICT (phone) DO NOTHING;

INSERT INTO public.consent_events (customer_id, phone, channel, action, source, created_at)
SELECT c.id, c.phone, 'sms', 'grant', c.signup_source, c.sms_consent_timestamp
FROM public.customers c WHERE c.sms_opt_in AND c.sms_consent_timestamp IS NOT NULL;