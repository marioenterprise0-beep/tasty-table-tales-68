import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FormSuccess, PhoneDisclaimer, YesNo, selectClass } from "@/components/form-bits";
import { AVAILABILITY, POSITIONS, PREFERRED_LOCATIONS } from "@/data/forms";
import { submitJobApplication } from "@/lib/leads.functions";

export function CareersForm() {
  const submit = useServerFn(submitJobApplication);
  const [status, setStatus] = React.useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [hasExperience, setHasExperience] = React.useState<boolean | null>(null);
  const [isAdult, setIsAdult] = React.useState<boolean | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (hasExperience === null || isAdult === null) {
      setError("Please answer the experience and age questions.");
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
          position: String(form.get("position") ?? POSITIONS[0]) as (typeof POSITIONS)[number],
          preferredLocation: String(
            form.get("preferredLocation") ?? PREFERRED_LOCATIONS[0],
          ) as (typeof PREFERRED_LOCATIONS)[number],
          availability: form.getAll("availability").map(String) as (typeof AVAILABILITY)[number][],
          hasExperience,
          experienceDetails: String(form.get("experienceDetails") ?? ""),
          isAdult,
          notes: String(form.get("notes") ?? ""),
          smsOptIn: form.get("smsOptIn") === "on",
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
        title="Application Received"
        message="Application received. We'll reach out if there's a fit."
      />
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="j-name" label="Full name">
          <Input id="j-name" name="fullName" required maxLength={120} autoComplete="name" />
        </Field>
        <div className="space-y-1.5">
          <Label htmlFor="j-phone" className="text-white/80">
            Phone
          </Label>
          <Input id="j-phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" />
          <PhoneDisclaimer />
        </div>
        <Field id="j-email" label="Email">
          <Input id="j-email" name="email" type="email" required maxLength={255} autoComplete="email" />
        </Field>
        <Field id="j-position" label="Position">
          <select id="j-position" name="position" required defaultValue={POSITIONS[0]} className={selectClass}>
            {POSITIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field id="j-location" label="Preferred location">
          <select
            id="j-location"
            name="preferredLocation"
            required
            defaultValue={PREFERRED_LOCATIONS[2]}
            className={selectClass}
          >
            {PREFERRED_LOCATIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <fieldset className="space-y-3 sm:col-span-2">
          <legend className="text-sm text-white/80">Availability</legend>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {AVAILABILITY.map((slot) => (
              <label key={slot} className="flex items-center gap-3 text-sm text-white/80">
                <input
                  type="checkbox"
                  name="availability"
                  value={slot}
                  className="size-4 accent-[var(--gold)]"
                />
                {slot}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="sm:col-span-2">
          <YesNo
            name="hasExperience"
            legend="Do you have food service experience?"
            value={hasExperience}
            onChange={setHasExperience}
          />
        </div>

        {hasExperience === true && (
          <div className="sm:col-span-2">
            <Field id="j-exp" label="If yes, tell us where">
              <Input id="j-exp" name="experienceDetails" maxLength={500} />
            </Field>
          </div>
        )}

        <div className="sm:col-span-2">
          <YesNo name="isAdult" legend="Are you 18 or older?" value={isAdult} onChange={setIsAdult} />
        </div>

        <div className="sm:col-span-2">
          <Field id="j-notes" label="Anything else you want us to know (optional)">
            <Textarea id="j-notes" name="notes" rows={4} maxLength={2000} />
          </Field>
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <Checkbox id="j-sms" name="smsOptIn" />
          <Label htmlFor="j-sms" className="text-sm font-normal text-white/80">
            Text me Gotham Halal deals and updates
          </Label>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={status === "sending"}
        className="pill-gold mt-6 px-8 py-3 text-[12px] disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Application"}
      </button>
    </form>
  );
}
