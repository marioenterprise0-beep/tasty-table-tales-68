ALTER TABLE public.opening_signups
  ADD COLUMN IF NOT EXISTS signup_source text NOT NULL DEFAULT 'opening_day',
  ALTER COLUMN location_slug DROP NOT NULL;

CREATE TABLE public.job_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  position text NOT NULL,
  preferred_location text NOT NULL,
  availability text[] NOT NULL DEFAULT '{}',
  has_experience boolean NOT NULL,
  experience_details text,
  is_adult boolean NOT NULL,
  notes text,
  sms_opt_in boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.franchise_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  market text NOT NULL,
  capital text NOT NULL,
  has_ownership_experience boolean NOT NULL,
  experience_details text,
  locations_interest text NOT NULL,
  timeline text NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.franchise_inquiries TO service_role;
ALTER TABLE public.franchise_inquiries ENABLE ROW LEVEL SECURITY;