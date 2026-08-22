import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneDisclaimer } from "@/components/form-bits";
import { TEXT_CLUB_CONFIRMATION } from "@/data/forms";
import { submitTextClub } from "@/lib/leads.functions";

export function TextClub() {
  const submit = useServerFn(submitTextClub);
  const [status, setStatus] = React.useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError(null);
    try {
      await submit({
        data: {
          firstName: String(form.get("firstName") ?? ""),
          phone: String(form.get("phone") ?? ""),
          source: "text_club",
        },
      });
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section className="border-y border-gold/15 bg-ink" aria-labelledby="text-club">
      <div className="mx-auto grid max-w-[1500px] items-center gap-8 px-5 py-12 md:px-10 lg:grid-cols-2">
        <div className="min-w-0">
          <h2 id="text-club" className="display text-[2rem] leading-[0.95] tracking-[-0.01em] text-white sm:text-[2.5rem]">
            Get The <span className="text-gold">Gotham Texts</span>
          </h2>
          <p className="mt-3 max-w-md text-[15px] leading-snug text-white/85">
            Menu drops, deals and new locations — straight to your phone before anyone else.
          </p>
        </div>

        {status === "done" ? (
          <p className="display text-[15px] tracking-[0.06em] text-gold">{TEXT_CLUB_CONFIRMATION}</p>
        ) : (
          <form onSubmit={onSubmit} className="w-full">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tc-name" className="text-white/80">
                  First name
                </Label>
                <Input id="tc-name" name="firstName" required maxLength={80} autoComplete="given-name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tc-phone" className="text-white/80">
                  Phone
                </Label>
                <Input id="tc-phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" />
              </div>
            </div>
            <PhoneDisclaimer />
            {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={status === "sending"}
              className="pill-gold mt-4 px-8 py-3 text-[12px] disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "I'm In"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
