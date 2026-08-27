import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { PageHeader } from "@/components/PageHeader";
import { confirmEmailVerification } from "@/lib/email-verify.functions";

export const Route = createFileRoute("/verify-email")({
  head: () => ({
    meta: [
      { title: "Confirm Your Email — Gotham Halal" },
      { name: "description", content: "Confirm your email address on your Gotham Halal account." },
      { property: "og:title", content: "Confirm Your Email — Gotham Halal" },
      { property: "og:description", content: "Confirm your email address for Gotham Halal updates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const confirm = useServerFn(confirmEmailVerification);
  const [message, setMessage] = React.useState("Checking your link…");
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token") ?? "";
    if (!token) {
      setMessage("That link is missing its confirmation code.");
      return;
    }
    confirm({ data: { token } })
      .then((r) => {
        setMessage(r.message);
        setDone(r.ok);
      })
      .catch(() => setMessage("Something went wrong. Please try the link again."));
  }, [confirm]);

  return (
    <div className="bg-ink">
      <PageHeader eyebrow="Account" title="Confirm Email" />
      <div className="mx-auto w-full max-w-md px-5 pb-24 text-center">
        <div className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6">
          <p className="text-sm text-white/80">{message}</p>
          {done && (
            <Link to="/account" className="pill-gold mt-6 inline-flex px-6 py-3 text-[12px]">
              Go To My Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
