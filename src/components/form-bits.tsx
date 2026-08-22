import * as React from "react";
import { Label } from "@/components/ui/label";
import { SMS_DISCLAIMER } from "@/data/forms";

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
      <Label htmlFor={id} className="text-white/80">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-[11.5px] leading-snug text-white/45">{hint}</p> : null}
    </div>
  );
}

/** Small print required under every phone field. */
export function PhoneDisclaimer() {
  return <p className="text-[11.5px] leading-snug text-white/45">{SMS_DISCLAIMER}</p>;
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
      <legend className="text-sm text-white/80">{legend}</legend>
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
    <div className="rounded-2xl border border-gold/30 bg-white/[0.03] p-8 text-center">
      <h3 className="display text-xl text-gold">{title}</h3>
      <p className="mt-3 text-sm text-white/80">{message}</p>
    </div>
  );
}
