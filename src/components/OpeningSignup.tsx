import * as React from "react";
import { useServerFn } from "@tanstack/react-start";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { submitOpeningSignup } from "@/lib/leads.functions";

/** One line of incentive copy shown above the fields. TODO: replace with the real offer. */
export const OPENING_OFFER_COPY =
  "Be first in line on opening day — the list gets our launch offer before anyone else.";

type Ctx = { open: () => void };
const OpeningSignupContext = React.createContext<Ctx>({ open: () => {} });

export function useOpeningSignup() {
  return React.useContext(OpeningSignupContext);
}

export function OpeningSignupProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const value = React.useMemo(() => ({ open: () => setOpen(true) }), []);

  return (
    <OpeningSignupContext.Provider value={value}>
      {children}
      <OpeningSignupDialog open={open} onOpenChange={setOpen} />
    </OpeningSignupContext.Provider>
  );
}

function OpeningSignupDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const submit = useServerFn(submitOpeningSignup);
  const [status, setStatus] = React.useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) {
      setStatus("idle");
      setError(null);
    }
  }, [open]);

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
          email: String(form.get("email") ?? ""),
          smsOptIn: form.get("smsOptIn") === "on",
          locationSlug: "jefferson-road",
        },
      });
      setStatus("done");
    } catch (e) {
      setStatus("idle");
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-gold/40 bg-ink text-foreground">
        <DialogHeader>
          <DialogTitle className="display text-left text-xl text-gold">Get Opening Day Alerts</DialogTitle>
          <DialogDescription className="text-left text-sm text-muted-foreground">
            {OPENING_OFFER_COPY}
          </DialogDescription>
        </DialogHeader>

        {status === "done" ? (
          <p className="py-6 text-center text-base text-cream">
            You&apos;re on the list. We&apos;ll text you before we open.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="os-first">First name</Label>
              <Input id="os-first" name="firstName" required maxLength={80} autoComplete="given-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="os-phone">Phone number</Label>
              <Input id="os-phone" name="phone" type="tel" required maxLength={30} autoComplete="tel" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="os-email">Email (optional)</Label>
              <Input id="os-email" name="email" type="email" maxLength={255} autoComplete="email" />
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="os-sms" name="smsOptIn" defaultChecked />
              <Label htmlFor="os-sms" className="text-sm font-normal">
                Text me when Jefferson Road opens
              </Label>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button type="submit" disabled={status === "sending"} className="pill-gold w-full px-6 py-3 text-[12px] disabled:opacity-60">
              {status === "sending" ? "Sending…" : "Count Me In"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
