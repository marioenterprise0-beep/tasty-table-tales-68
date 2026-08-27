import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";
import { useServerFn } from "@tanstack/react-start";
import { toUsCanadaE164, formatPhone } from "@/lib/phone";
import { useSession } from "@/hooks/useSession";
import { requestPhoneCode, verifyPhoneCode } from "@/lib/otp.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Gotham Halal Account" },
      {
        name: "description",
        content:
          "Sign in to your Gotham Halal account with your phone number to manage your text and email preferences.",
      },
      { property: "og:title", content: "Sign In — Gotham Halal Account" },
      {
        property: "og:description",
        content: "Phone-first sign in for Gotham Halal customers in Rochester, NY.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

type Step = "phone" | "code" | "email-sent";

function AuthPage() {
  const navigate = useNavigate();
  const { session } = useSession();
  const [step, setStep] = React.useState<Step>("phone");
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showEmail, setShowEmail] = React.useState(false);
  const [company, setCompany] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");

  async function signInWithPassword(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: pwError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (pwError) {
      setError(pwError.message);
      return;
    }
    navigate({ to: "/account", replace: true });
  }

  const mountedAt = React.useRef(Date.now());
  const sendOtp = useServerFn(requestPhoneCode);
  const checkOtp = useServerFn(verifyPhoneCode);

  React.useEffect(() => {
    if (session) navigate({ to: "/account", replace: true });
  }, [session, navigate]);

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    if (!toUsCanadaE164(phone)) {
      setError("Enter a valid 10-digit US or Canada number.");
      return;
    }
    setBusy(true);
    setError(null);
    const result = await sendOtp({
      data: { phone, company, elapsedMs: Date.now() - mountedAt.current },
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.message);
      if ("providerDown" in result && result.providerDown) setShowEmail(true);
      return;
    }
    setStep("code");
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await checkOtp({ data: { phone, code: code.trim() } });
    if (!result.ok) {
      setBusy(false);
      setError(result.message);
      return;
    }
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    });
    setBusy(false);
    if (sessionError) {
      setError("We verified your code but couldn't start your session. Please try again.");
      return;
    }
    navigate({ to: "/account", replace: true });
  }

  async function sendMagicLink(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: linkError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/account` },
    });
    setBusy(false);
    if (linkError) {
      setError(linkError.message);
      return;
    }
    setStep("email-sent");
  }

  return (
    <div className="bg-ink">
      <PageHeader
        eyebrow="Gotham Halal"
        title="Sign In"
        blurb="Your phone number is your account — no password to remember."
      />

      <div className="mx-auto w-full max-w-md px-5 pb-24">
        <div className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6">
          {step === "phone" && (
            <form onSubmit={sendCode} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="auth-phone" className="text-white/80">
                  Phone number
                </Label>
                <Input
                  id="auth-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  maxLength={30}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(585) 555-0123"
                />
                <p className="text-[11.5px] leading-snug text-white/45">
                  We&apos;ll text you a one-time code to verify it&apos;s you. Standard message and
                  data rates may apply. This code is not marketing — you choose your notification
                  preferences after signing in.
                </p>
              </div>
              {/* Honeypot: hidden from people and screen readers, irresistible to bots. */}
              <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="auth-company">Company</label>
                <input
                  id="auth-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={busy} className="pill-gold w-full px-6 py-3 text-[12px] disabled:opacity-60">
                {busy ? "Sending…" : "Send Code"}
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={verifyCode} className="space-y-4">
              <p className="text-sm text-white/80">
                Enter the code we texted to {formatPhone(toUsCanadaE164(phone))}.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="auth-code" className="text-white/80">
                  6-digit code
                </Label>
                <Input
                  id="auth-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={10}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={busy} className="pill-gold w-full px-6 py-3 text-[12px] disabled:opacity-60">
                {busy ? "Verifying…" : "Verify & Sign In"}
              </button>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="w-full text-center text-[12px] text-white/60 underline"
              >
                Use a different number
              </button>
            </form>
          )}

          {step === "email-sent" && (
            <div className="space-y-3 text-center">
              <h2 className="display text-lg text-gold">Check your email</h2>
              <p className="text-sm text-white/80">
                We sent a sign-in link to {email}. Open it on this device to finish signing in.
              </p>
            </div>
          )}

          {step !== "email-sent" && (
            <div className="mt-6 border-t border-white/10 pt-5">
              {showEmail ? (
                <form onSubmit={sendMagicLink} className="space-y-3">
                  <Label htmlFor="auth-email" className="text-white/80">
                    Email sign-in link
                  </Label>
                  <Input
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-full border border-gold/50 px-6 py-3 text-[12px] display tracking-[0.14em] text-gold hover:bg-gold/10 disabled:opacity-60"
                  >
                    {busy ? "Sending…" : "Email Me A Link"}
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowEmail(true)}
                  className="w-full text-center text-[12px] text-white/60 underline"
                >
                  Trouble with texts? Sign in by email instead
                </button>
              )}
              {showPassword ? (
                <form onSubmit={signInWithPassword} className="mt-4 space-y-3">
                  <Label htmlFor="auth-staff-email" className="text-white/80">
                    Staff email &amp; password
                  </Label>
                  <Input
                    id="auth-staff-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    id="auth-staff-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full rounded-full border border-gold/50 px-6 py-3 text-[12px] display tracking-[0.14em] text-gold hover:bg-gold/10 disabled:opacity-60"
                  >
                    {busy ? "Signing in…" : "Staff Sign In"}
                  </button>
                  {resetNote && <p className="text-sm text-white/70">{resetNote}</p>}
                  <button
                    type="button"
                    onClick={sendPasswordReset}
                    disabled={busy}
                    className="w-full text-center text-[11.5px] text-white/55 underline disabled:opacity-60"
                  >
                    Forgot password? Email me a reset link
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPassword(true)}
                  className="mt-3 w-full text-center text-[11.5px] text-white/40 underline"
                >
                  Staff sign-in
                </button>
              )}

            </div>
          )}

        </div>

        <p className="mt-5 text-center text-[11.5px] text-white/45">
          By signing in you agree to our terms. Questions?{" "}
          <Link to="/contact" className="underline hover:text-gold">
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
