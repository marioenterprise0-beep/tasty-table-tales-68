import * as React from "react";
import { X } from "lucide-react";
import { useOpeningSignup } from "./OpeningSignup";

const KEY = "gh-announcement-dismissed";

export function AnnouncementBar() {
  const [hidden, setHidden] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const { open } = useOpeningSignup();

  React.useEffect(() => {
    setMounted(true);
    try {
      if (sessionStorage.getItem(KEY) === "1") setHidden(true);
    } catch {
      /* sessionStorage unavailable */
    }
  }, []);

  if (!mounted || hidden) return null;

  return (
    <div className="relative z-[60] bg-ink text-gold">
      <div className="mx-auto flex max-w-[1600px] items-center justify-center gap-3 px-10 py-2 md:px-12">
        <button
          type="button"
          onClick={open}
          className="display text-center text-[10px] leading-tight tracking-[0.14em] underline-offset-4 hover:underline sm:text-[11px]"
        >
          Jefferson Road opens September 18 — get on the list
        </button>
      </div>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          setHidden(true);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {
            /* ignore */
          }
        }}
        className="absolute inset-y-0 right-2 inline-flex items-center px-2 text-gold/70 transition hover:text-gold"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
