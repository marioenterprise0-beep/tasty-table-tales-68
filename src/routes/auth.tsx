import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";
import { normalizePhone, formatPhone } from "@/lib/phone";
import { useSession } from "@/hooks/useSession";

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

  React.useEffect(() => {
    if (session) navigate({ to: "/account", replace: true });
  }, [session, navigate]);

  async function sendCode(event: React.FormEvent) {
    event.preventDefault();
    const e164 = normalizePhone(phone);
    if (!e164) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    setBusy(true);
    setError(null);
    const { error: otpError } = await supabase.auth.signInWithOtp({ phone: e164 });
    setBusy(false);
    if (otpError) {
      setError(
        `${otpError.message} — if text sign-in isn't live yet, use the email option below.`,
      );
      setShowEmail(true);
      return;
    }
    setStep("code");
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    const e164 = normalizePhone(phone);
    if (!e164) return;
    setBusy(true);
    setError(null);
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: e164,
      token: code.trim(),
      type: "sms",
    });
    setBusy(false);
    if (verifyError) {
      setError(verifyError.message);
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
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button type="submit" disabled={busy} className="pill-gold w-full px-6 py-3 text-[12px] disabled:opacity-60">
                {busy ? "Sending…" : "Send Code"}
              </button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={verifyCode} className="space-y-4">
              <p className="text-sm text-white/80">
                Enter the code we texted to {formatPhone(normalizePhone(phone))}.
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
