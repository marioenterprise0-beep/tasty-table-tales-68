import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password — Gotham Halal" },
      {
        name: "description",
        content: "Set a new password for your Gotham Halal staff account.",
      },
      { property: "og:title", content: "Reset Password — Gotham Halal" },
      { property: "og:description", content: "Set a new password for your Gotham Halal account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    // A recovery link can arrive in three shapes depending on the email flow:
    // 1) ?code=...            (PKCE)
    // 2) ?token_hash=&type=   (OTP verify)
    // 3) #access_token=...    (implicit, parsed automatically by the client)
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) setReady(true);
    });

    (async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const tokenHash = url.searchParams.get("token_hash");
      const type = url.searchParams.get("type");
      const urlError = url.searchParams.get("error_description");

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) setError(exchangeError.message);
      } else if (tokenHash) {
        const { error: otpError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: (type as "recovery") ?? "recovery",
        });
        if (otpError) setError(otpError.message);
      } else if (urlError) {
        setError(urlError);
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setReady(true);
        window.history.replaceState({}, "", "/reset-password");
      }
    })();

    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }
    setBusy(true);
    setError(null);
    // Recovery sessions are exempt from the current-password requirement.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/account", replace: true }), 1200);
  }

  return (
    <div className="bg-ink">
      <PageHeader
        eyebrow="Account"
        title="Reset Password"
        blurb="Choose a new password for your staff sign-in."
      />
      <div className="mx-auto w-full max-w-md px-5 pb-24">
        <div className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6">
          {done ? (
            <p className="text-sm text-white/80">
              Password updated. Taking you to your account…
            </p>
          ) : !ready ? (
            <p className="text-sm text-white/70">
              Open this page from the reset link in your email. If you landed here directly,{" "}
              <Link to="/auth" className="underline hover:text-gold">
                request a new link
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="new-password" className="text-white/80">
                  New password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password" className="text-white/80">
                  Confirm password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="pill-gold w-full px-6 py-3 text-[12px] disabled:opacity-60"
              >
                {busy ? "Saving…" : "Set New Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
