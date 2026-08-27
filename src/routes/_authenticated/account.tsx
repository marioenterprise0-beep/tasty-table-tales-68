import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/PageHeader";
import { selectClass } from "@/components/form-bits";
import { formatPhone } from "@/lib/phone";
import {
  SMS_CONSENT_DISCLOSURE,
  EMAIL_CONSENT_DISCLOSURE,
  BUSINESS_MAILING_ADDRESS,
} from "@/lib/customers.schemas";
import {
  getMyAccount,
  updateMyProfile,
  updateMyPreferences,
  deleteMyAccount,
} from "@/lib/customers.functions";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My Account — Gotham Halal" },
      {
        name: "description",
        content: "Manage your Gotham Halal profile and your text and email notification preferences.",
      },
      { property: "og:title", content: "My Account — Gotham Halal" },
      { property: "og:description", content: "Manage your Gotham Halal notification preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function AccountPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchAccount = useServerFn(getMyAccount);
  const saveProfile = useServerFn(updateMyProfile);
  const savePrefs = useServerFn(updateMyPreferences);
  const removeAccount = useServerFn(deleteMyAccount);

  const { data: account, isLoading } = useQuery({
    queryKey: ["my-account"],
    queryFn: () => fetchAccount({ data: undefined }),
  });

  const [profileStatus, setProfileStatus] = React.useState<string | null>(null);
  const [prefStatus, setPrefStatus] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [sms, setSms] = React.useState(false);
  const [emailOpt, setEmailOpt] = React.useState(false);
  const [savingPrefs, setSavingPrefs] = React.useState(false);

  React.useEffect(() => {
    if (account) {
      setSms(account.sms_opt_in);
      setEmailOpt(account.email_opt_in);
    }
  }, [account]);

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  async function onSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError(null);
    setProfileStatus(null);
    try {
      await saveProfile({
        data: {
          firstName: String(form.get("firstName") ?? ""),
          lastName: String(form.get("lastName") ?? ""),
          email: String(form.get("email") ?? ""),
          birthdayMonth: form.get("birthdayMonth") ? Number(form.get("birthdayMonth")) : null,
          birthdayDay: form.get("birthdayDay") ? Number(form.get("birthdayDay")) : null,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["my-account"] });
      setProfileStatus("Saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  async function onSavePrefs() {
    setError(null);
    setPrefStatus(null);
    setSavingPrefs(true);
    try {
      await savePrefs({ data: { smsOptIn: sms, emailOptIn: emailOpt } });
      await queryClient.invalidateQueries({ queryKey: ["my-account"] });
      setPrefStatus("Preferences saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSavingPrefs(false);
    }
  }

  async function onDelete() {
    try {
      await removeAccount({ data: undefined });
      queryClient.clear();
      await supabase.auth.signOut();
      navigate({ to: "/", replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't delete your account.");
    }
  }

  return (
    <div className="bg-ink">
      <PageHeader eyebrow="Gotham Halal" title="My Account" blurb="Your details and how we reach you." />

      <div className="mx-auto w-full max-w-2xl space-y-8 px-5 pb-24">
        {isLoading || !account ? (
          <p className="text-sm text-white/60">Loading your account…</p>
        ) : (
          <>
            <section className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6">
              <h2 className="display text-lg text-gold">Your Details</h2>
              <p className="mt-1 text-[12.5px] text-white/50">
                Phone: {formatPhone(account.phone.startsWith("+") ? account.phone : null)}
                {account.phone_verified ? " · verified" : " · not yet verified"}
              </p>

              <form onSubmit={onSaveProfile} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-first" className="text-white/80">First name</Label>
                    <Input id="acc-first" name="firstName" required maxLength={80} defaultValue={account.first_name ?? ""} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-last" className="text-white/80">Last name (optional)</Label>
                    <Input id="acc-last" name="lastName" maxLength={80} defaultValue={account.last_name ?? ""} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="acc-email" className="text-white/80">Email (optional)</Label>
                  <Input id="acc-email" name="email" type="email" maxLength={255} defaultValue={account.email ?? ""} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-bmonth" className="text-white/80">Birthday month (optional)</Label>
                    <select id="acc-bmonth" name="birthdayMonth" className={selectClass} defaultValue={account.birthday_month ?? ""}>
                      <option value="">—</option>
                      {MONTHS.map((m, i) => (
                        <option key={m} value={i + 1}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="acc-bday" className="text-white/80">Birthday day (optional)</Label>
                    <select id="acc-bday" name="birthdayDay" className={selectClass} defaultValue={account.birthday_day ?? ""}>
                      <option value="">—</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {profileStatus && <p className="text-sm text-gold">{profileStatus}</p>}
                <button type="submit" className="pill-gold px-7 py-3 text-[12px]">Save Details</button>
              </form>
            </section>

            <section className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6">
              <h2 className="display text-lg text-gold">Notifications</h2>
              <p className="mt-1 text-[13px] text-white/60">
                Both are optional. Your account works whether or not you opt in.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <p className="text-[15px] leading-relaxed text-white/85">{SMS_CONSENT_DISCLOSURE}</p>
                  <label className="mt-3 flex items-start gap-3">
                    <Checkbox
                      id="pref-sms"
                      checked={sms}
                      onCheckedChange={(v) => setSms(v === true)}
                      className="mt-0.5"
                    />
                    <span className="text-[15px] text-white/90">Yes, text me marketing messages from Gotham Halal</span>
                  </label>
                  {account.sms_consent_timestamp && (
                    <p className="mt-2 text-[12px] text-white/45">
                      Consent given {formatDate(account.sms_consent_timestamp)}
                    </p>
                  )}
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-[15px] leading-relaxed text-white/85">{EMAIL_CONSENT_DISCLOSURE}</p>
                  <label className="mt-3 flex items-start gap-3">
                    <Checkbox
                      id="pref-email"
                      checked={emailOpt}
                      onCheckedChange={(v) => setEmailOpt(v === true)}
                      className="mt-0.5"
                    />
                    <span className="text-[15px] text-white/90">Yes, email me news and offers</span>
                  </label>
                  {!account.email && (
                    <p className="mt-2 text-[12px] text-white/45">Add an email above to receive emails.</p>
                  )}
                  {account.email_consent_timestamp && (
                    <p className="mt-2 text-[12px] text-white/45">
                      Consent given {formatDate(account.email_consent_timestamp)}
                    </p>
                  )}
                </div>
              </div>

              {prefStatus && <p className="mt-4 text-sm text-gold">{prefStatus}</p>}
              <button
                type="button"
                onClick={onSavePrefs}
                disabled={savingPrefs}
                className="pill-gold mt-5 px-7 py-3 text-[12px] disabled:opacity-60"
              >
                {savingPrefs ? "Saving…" : "Save Preferences"}
              </button>
              <p className="mt-4 text-[11.5px] text-white/40">{BUSINESS_MAILING_ADDRESS}</p>
            </section>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <section className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-gold/50 px-7 py-3 display text-[12px] tracking-[0.14em] text-gold hover:bg-gold/10"
              >
                Sign Out
              </button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button type="button" className="text-[12.5px] text-destructive underline">
                    Delete my account
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-gold/30 bg-ink">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="display text-gold">Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently deletes your Gotham Halal account and notification
                      preferences. You&apos;ll stop receiving messages. This can&apos;t be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>Delete account</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
