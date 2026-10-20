import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { SMS_DISCLAIMER } from "@/data/forms";
import { Check } from "lucide-react";

export function FormSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <fieldset className="request-section min-w-0">
    <legend className="mb-5 flex items-center gap-3 text-base font-semibold text-foreground">
      <span className="flex size-7 items-center justify-center rounded-full border border-gold/40 text-xs text-gold">{number}</span>
      {title}
    </legend>
    <div className="grid items-start gap-x-6 gap-y-5 sm:grid-cols-2">{children}</div>
  </fieldset>;
}

export const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-foreground/85">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/** Small print required under every phone field. */
export function PhoneDisclaimer() {
  return (
    <p className="text-xs leading-relaxed text-muted-foreground">
      {SMS_DISCLAIMER} See our{" "}
      <Link to="/privacy" className="underline underline-offset-2 hover:text-gold">
        Privacy Policy
      </Link>{" "}
      and{" "}
      <Link to="/terms" className="underline underline-offset-2 hover:text-gold">
        Terms
      </Link>
      .
    </p>
  );
}

export function YesNo({
  name,
  value,
  onChange,
  legend,
}: {
  name: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
  legend: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm text-foreground/85">{legend}</legend>
      <div className="flex gap-3">
        {[true, false].map((option) => (
          <label
            key={String(option)}
            className={`display cursor-pointer rounded-full border px-5 py-2 text-[11px] tracking-[0.12em] transition ${
              value === option
                ? "border-gold bg-gold text-gold-foreground"
                : "border-gold/40 text-gold hover:bg-gold/10"
            }`}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={value === option}
              onChange={() => onChange(option)}
            />
            {option ? "Yes" : "No"}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function FormSuccess({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-lg border border-gold/30 bg-card p-8 text-center">
      <Check className="mx-auto mb-4 size-8 text-gold" />
      <h3 className="display text-xl text-gold">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
