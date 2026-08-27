-- Rate limit / abuse log for OTP + admin exports
CREATE TABLE public.rate_limit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL,
  phone text,
  ip_address text,
  user_agent text,
  actor_user_id uuid,
  outcome text NOT NULL DEFAULT 'allowed',
  detail text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.rate_limit_log TO service_role;
ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_rate_limit_log_phone_time ON public.rate_limit_log (phone, kind, created_at DESC);
CREATE INDEX idx_rate_limit_log_ip_time ON public.rate_limit_log (ip_address, kind, created_at DESC);
CREATE INDEX idx_rate_limit_log_actor_time ON public.rate_limit_log (actor_user_id, kind, created_at DESC);

-- Lockouts after repeated failed code entry
CREATE TABLE public.otp_lockouts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone text NOT NULL UNIQUE,
  failed_attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  last_failed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.otp_lockouts TO service_role;
ALTER TABLE public.otp_lockouts ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_otp_lockouts_updated_at
  BEFORE UPDATE ON public.otp_lockouts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Admin audit trail
CREATE TABLE public.admin_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id uuid NOT NULL,
  admin_label text,
  action text NOT NULL,
  target_type text,
  target_id text,
  row_count integer,
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.admin_audit_log TO service_role;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_admin_audit_log_created ON public.admin_audit_log (created_at DESC);
CREATE INDEX idx_admin_audit_log_admin_action ON public.admin_audit_log (admin_user_id, action, created_at DESC);

-- Email verification for the magic-link fallback
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS email_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_verify_token uuid,
  ADD COLUMN IF NOT EXISTS email_verify_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_verify_target text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_email_verify_token
  ON public.customers (email_verify_token) WHERE email_verify_token IS NOT NULL;