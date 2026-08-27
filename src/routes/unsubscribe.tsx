import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { PageHeader } from "@/components/PageHeader";
import { BUSINESS_MAILING_ADDRESS } from "@/lib/customers.schemas";
import { lookupUnsubscribe, confirmUnsubscribe } from "@/lib/unsubscribe.functions";

const searchSchema = z.object({ token: z.string().optional() });

export const Route = createFileRoute("/unsubscribe")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Unsubscribe — Gotham Halal Emails" },
      {
        name: "description",
        content: "Opt out of Gotham Halal marketing emails. No sign-in required.",
      },
      { property: "og:title", content: "Unsubscribe — Gotham Halal Emails" },
      { property: "og:description", content: "Opt out of Gotham Halal marketing emails." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: UnsubscribePage,
});

function UnsubscribePage() {
  const { token } = Route.useSearch();
  const lookup = useServerFn(lookupUnsubscribe);
  const confirm = useServerFn(confirmUnsubscribe);
  const [state, setState] = React.useState<"loading" | "ready" | "done" | "invalid">("loading");
  const [masked, setMasked] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!token) {
      setState("invalid");
      return;
    }
    lookup({ data: { token } })
      .then((result) => {
        if (!result.found) {
          setState("invalid");
          return;
        }
        setMasked(result.email);
        setState(result.optedIn ? "ready" : "done");
      })
      .catch(() => setState("invalid"));
  }, [token, lookup]);

  async function onConfirm() {
    if (!token) return;
    setBusy(true);
    try {
      await confirm({ data: { token } });
      setState("done");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-ink">
      <PageHeader eyebrow="Email preferences" title="Unsubscribe" />
      <div className="mx-auto w-full max-w-md px-5 pb-24 text-center">
        <div className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6">
          {state === "loading" && <p className="text-sm text-white/70">Checking your link…</p>}
          {state === "invalid" && (
            <p className="text-sm text-white/70">
              This unsubscribe link isn&apos;t valid. Reply STOP to any of our texts, or email
              hello@gothamhalal.com and we&apos;ll take you off the list.
            </p>
          )}
          {state === "ready" && (
            <>
              <p className="text-sm text-white/80">
                Stop marketing emails to {masked ?? "this address"}?
              </p>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="pill-gold mt-5 px-7 py-3 text-[12px] disabled:opacity-60"
              >
                {busy ? "Working…" : "Unsubscribe Me"}
              </button>
            </>
          )}
          {state === "done" && (
            <p className="text-sm text-white/80">
              You&apos;re unsubscribed. You won&apos;t receive marketing emails from us again.
            </p>
          )}
        </div>
        <p className="mt-5 text-[11.5px] text-white/40">{BUSINESS_MAILING_ADDRESS}</p>
      </div>
    </div>
  );
}
