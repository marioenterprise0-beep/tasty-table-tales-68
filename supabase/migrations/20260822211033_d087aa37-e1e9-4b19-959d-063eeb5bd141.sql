CREATE TABLE public.opening_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  sms_opt_in BOOLEAN NOT NULL DEFAULT true,
  location_slug TEXT NOT NULL DEFAULT 'jefferson-road',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.opening_signups TO service_role;
ALTER TABLE public.opening_signups ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.catering_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  event_date DATE NOT NULL,
  headcount INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  event_location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT ALL ON public.catering_leads TO service_role;
ALTER TABLE public.catering_leads ENABLE ROW LEVEL SECURITY;