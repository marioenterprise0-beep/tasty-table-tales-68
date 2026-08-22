import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field, FormSuccess, PhoneDisclaimer, YesNo, selectClass } from "@/components/form-bits";
import { CAPITAL_RANGES, LOCATION_COUNTS, TIMELINES } from "@/data/forms";
import { submitFranchiseInquiry } from "@/lib/leads.functions";

export function FranchiseForm() {
  const submit = useServerFn(submitFranchiseInquiry);
  const [status, setStatus] = React.useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [hasOwnership, setHasOwnership] = React.useState<boolean | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (hasOwnership === null) {
      setError("Please tell us whether you have ownership experience.");
      return;
    }
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError(null);
    try {
      await submit({
        data: {
          fullName: String(form.get("fullName") ?? ""),
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? ""),
          market: String(form.get("market") ?? ""),
          capital: String(form.get("capital") ?? CAPITAL_RANGES[0]) as (typeof CAPITAL_RANGES)[number],
          hasOwnershipExperience: hasOwnership,
          experienceDetails: String(form.get("experienceDetails") ?? ""),
          locationsInterest: String(
            form.get("locationsInterest") ?? LOCATION_COUNTS[0],
          ) as (typeof LOCATION_COUNTS)[number],
          timeline: String(form.get("timeline") ?? TIMELINES[0]) as (typeof TIMELINES)[number],
          notes: String(form.get("notes") ?? ""),
        },
      });
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <FormSuccess
        title="Inquiry Received"
        message="Got it. If there's a fit we'll be in touch within a week."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="f-name" label="Full name">
          <Input id="f-name" name="fullName" required maxLength={120} autoComplete="name" />
        </Field>
        <div className="space-y-1.5">
          <Label htmlFor="f-phone" className="text-white/80">
            Phone
          </Label>
          <Input id="f-phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" />
          <PhoneDisclaimer />
        </div>
        <Field id="f-email" label="Email">
          <Input id="f-email" name="email" type="email" required maxLength={255} autoComplete="email" />
        </Field>
        <Field id="f-market" label="City / market of interest">
          <Input id="f-market" name="market" required maxLength={160} />
        </Field>
        <Field id="f-capital" label="Capital available to invest">
          <select id="f-capital" name="capital" required defaultValue={CAPITAL_RANGES[1]} className={selectClass}>
            {CAPITAL_RANGES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field id="f-count" label="How many locations are you interested in opening?">
          <select
            id="f-count"
            name="locationsInterest"
            required
            defaultValue={LOCATION_COUNTS[0]}
            className={selectClass}
          >
            {LOCATION_COUNTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field id="f-timeline" label="Timeline">
          <select id="f-timeline" name="timeline" required defaultValue={TIMELINES[1]} className={selectClass}>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <YesNo
            name="hasOwnershipExperience"
            legend="Do you have restaurant or food service ownership experience?"
            value={hasOwnership}
            onChange={setHasOwnership}
          />
        </div>

        {hasOwnership === true && (
          <div className="sm:col-span-2">
            <Field id="f-exp" label="If yes, describe it">
              <Textarea id="f-exp" name="experienceDetails" rows={4} maxLength={2000} />
            </Field>
          </div>
        )}

        <div className="sm:col-span-2">
          <Field id="f-notes" label="Anything else (optional)">
            <Textarea id="f-notes" name="notes" rows={4} maxLength={2000} />
          </Field>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="pill-gold mt-6 px-8 py-3 text-[12px] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit Inquiry"}
      </button>
    </form>
  );
}
