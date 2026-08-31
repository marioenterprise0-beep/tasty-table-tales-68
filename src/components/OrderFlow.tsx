import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LOCATIONS } from "@/data/locations";
import { ORDER_URL, buildOrderUrl } from "@/lib/order";
import { trackOrderClick } from "@/lib/analytics";
import { getLocationSettings } from "@/lib/content.functions";

const LS_KEY = "gh-order-location";

export type OrderLocation = {
  slug: string;
  name: string;
  orderUrl: string;
  enabled: boolean;
};

type PickerRequest = { content: string; categorySlug: string | null };

type OrderFlowValue = {
  locations: OrderLocation[];
  /** Generic CTA: uses the saved location or opens the picker. */
  order: (content: string, categorySlug?: string | null) => void;
  /** Location-specific CTA ("Order From Here"): skips the picker. */
  orderAt: (slug: string, content: string, categorySlug?: string | null) => void;
  /** Reopens the picker so returning customers can switch locations. */
  openPicker: () => void;
};

const OrderFlowContext = React.createContext<OrderFlowValue | null>(null);

export function useOrderFlow() {
  const ctx = React.useContext(OrderFlowContext);
  if (!ctx) throw new Error("useOrderFlow must be used inside OrderFlowProvider");
  return ctx;
}

/** Static fallback if the settings read fails — matches the pre-DB behavior. */
function fallbackLocations(): OrderLocation[] {
  return LOCATIONS.map((l) => ({
    slug: l.slug,
    name: l.shortName,
    orderUrl: l.orderUrl ?? ORDER_URL,
    enabled: l.status === "open",
  }));
}

export function OrderFlowProvider({ children }: { children: React.ReactNode }) {
  const { data } = useQuery({
    queryKey: ["location-settings"],
    queryFn: async () => {
      try {
        return await getLocationSettings();
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });

  const locations = React.useMemo<OrderLocation[]>(() => {
    const base = fallbackLocations();
    if (!data?.length) return base;
    return base.map((b) => {
      const row = data.find((r) => r.location_slug === b.slug);
      return row ? { ...b, orderUrl: row.order_url || b.orderUrl, enabled: row.is_order_enabled } : b;
    });
  }, [data]);

  const [picker, setPicker] = React.useState<PickerRequest | null>(null);

  const go = React.useCallback((loc: OrderLocation, req: PickerRequest) => {
    trackOrderClick(req.content);
    try {
      window.localStorage.setItem(LS_KEY, loc.slug);
    } catch {
      /* storage unavailable */
    }
    window.location.assign(
      buildOrderUrl({ base: loc.orderUrl, content: req.content, categorySlug: req.categorySlug }),
    );
  }, []);

  const orderAt = React.useCallback(
    (slug: string, content: string, categorySlug?: string | null) => {
      const loc = locations.find((l) => l.slug === slug);
      if (loc) go(loc, { content, categorySlug: categorySlug ?? null });
    },
    [locations, go],
  );

  const order = React.useCallback(
    (content: string, categorySlug?: string | null) => {
      const enabled = locations.filter((l) => l.enabled);
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem(LS_KEY);
      } catch {
        /* ignore */
      }
      if (saved && enabled.some((l) => l.slug === saved)) {
        orderAt(saved, content, categorySlug);
        return;
      }
      if (enabled.length <= 1) {
        if (enabled[0]) go(enabled[0], { content, categorySlug: categorySlug ?? null });
        return;
      }
      setPicker({ content, categorySlug: categorySlug ?? null });
    },
    [locations, go, orderAt],
  );

  const value = React.useMemo<OrderFlowValue>(
    () => ({ locations, order, orderAt, openPicker: () => setPicker({ content: "change_location", categorySlug: null }) }),
    [locations, order, orderAt],
  );

  return (
    <OrderFlowContext.Provider value={value}>
      {children}
      <Dialog open={picker !== null} onOpenChange={(open) => !open && setPicker(null)}>
        <DialogContent className="border-gold/40 bg-ink text-cream sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="display text-xl text-gold">Which location?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Pick your Gotham Halal — we&apos;ll remember it for next time.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 grid gap-3">
            {locations.map((loc) => (
              <button
                key={loc.slug}
                type="button"
                disabled={!loc.enabled}
                onClick={() => {
                  const req = picker ?? { content: "picker", categorySlug: null };
                  setPicker(null);
                  go(loc, req);
                }}
                className="display flex items-center justify-between gap-4 rounded-full border border-gold/40 px-6 py-3.5 text-[12px] tracking-[0.14em] text-gold transition hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gold"
              >
                <span>{loc.name.toUpperCase()}</span>
                {!loc.enabled && (
                  <span className="text-[10px] tracking-[0.16em] text-white/50">OPENING SOON</span>
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </OrderFlowContext.Provider>
  );
}
