import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitCateringLead } from "@/lib/leads.functions";

/** Today in YYYY-MM-DD, local time — used to block past dates. */
function todayIso() {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}

const EVENT_TYPES = ["Office Lunch", "Party", "Wedding", "Corporate Event", "Other"] as const;

export const CATERING_EMAIL = "hello@gothamhalal.com";

export function CateringForm() {
  const submit = useServerFn(submitCateringLead);
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
          fullName: String(form.get("fullName") ?? ""),
          phone: String(form.get("phone") ?? ""),
          email: String(form.get("email") ?? ""),
          eventDate: String(form.get("eventDate") ?? ""),
          headcount: Number(form.get("headcount") ?? 0),
          eventType: String(form.get("eventType") ?? "Other") as (typeof EVENT_TYPES)[number],
          eventLocation: String(form.get("eventLocation") ?? ""),
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
      <div className="rounded-2xl border border-gold/30 bg-white/[0.03] p-8 text-center">
        <h3 className="display text-xl text-gold">Request Received</h3>
        <p className="mt-3 text-sm text-white/80">
          Thanks — we&apos;ll get back to you within one business day. Need it sooner? Email{" "}
          <a href={`mailto:${CATERING_EMAIL}`} className="text-gold hover:underline">
            {CATERING_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-gold/25 bg-white/[0.03] p-6 md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label="Full name">
          <Input id="c-name" name="fullName" required maxLength={120} autoComplete="name" />
        </Field>
        <Field id="c-phone" label="Phone">
          <Input id="c-phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" />
        </Field>
        <Field id="c-email" label="Email">
          <Input id="c-email" name="email" type="email" required maxLength={255} autoComplete="email" />
        </Field>
        <Field id="c-date" label="Event date">
          <Input
            id="c-date"
            name="eventDate"
            type="date"
            required
            defaultValue=""
            min={todayIso()}
            placeholder="Select a date"
          />
        </Field>
        <Field id="c-count" label="Headcount">
          <Input id="c-count" name="headcount" type="number" min={1} max={100000} required />
        </Field>
        <Field id="c-type" label="Event type">
          <select
            id="c-type"
            name="eventType"
            required
            defaultValue="Office Lunch"
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field id="c-loc" label="Delivery location (optional)">
            <Input id="c-loc" name="eventLocation" maxLength={300} />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field id="c-notes" label="Notes (optional)">
            <Textarea id="c-notes" name="notes" rows={4} maxLength={2000} />
          </Field>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="pill-gold px-8 py-3 text-[12px] disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Request Catering"}
        </button>
        <a href={`mailto:${CATERING_EMAIL}`} className="text-sm text-white/70 hover:text-gold">
          or email {CATERING_EMAIL}
        </a>
      </div>
    </form>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-white/80">
        {label}
      </Label>
      {children}
    </div>
  );
}
