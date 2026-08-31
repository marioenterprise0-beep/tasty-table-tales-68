import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { Minus, Plus, MapPin, CheckCircle2 } from "lucide-react";
import { BrandImage } from "@/components/BrandImage";
import { menuImage } from "@/data/images";
import {
  OPEN_LOCATIONS,
  isOpenNow,
  todayHours,
  hoursLabel,
  nextOpeningLabel,
} from "@/data/locations";
import { useNow } from "@/components/LocationsBlock";
import { formatPrice } from "@/lib/order";
import { placeOrder } from "@/lib/orders.functions";
import { COMBO_UPCHARGE, ORDER_ITEMS, unitPriceFor, type OrderItemKey } from "@/lib/orders.schemas";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order Pickup — Gotham Halal" },
      {
        name: "description",
        content:
          "Order Gotham Halal smash burgers for pickup in Rochester, NY. Single and Double Smash, made fresh. Pay at pickup.",
      },
      { property: "og:title", content: "Order Pickup — Gotham Halal" },
      {
        property: "og:description",
        content: "Order Single and Double Smash burgers for pickup. Pay at pickup.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/order" },
    ],
    links: [{ rel: "canonical", href: "/order" }],
  }),
  component: OrderPage,
});

type OrderResult = {
  orderNumber: string;
  total: number;
  locationName: string;
  locationAddress: string;
  locationPhone: string;
};

function OrderPage() {
  const [item, setItem] = useState<OrderItemKey>("single");
  const [combo, setCombo] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [locationSlug, setLocationSlug] = useState(OPEN_LOCATIONS[0]?.slug ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const now = useNow();
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResult | null>(null);

  const unit = unitPriceFor(item, combo);
  const total = useMemo(() => unit * quantity, [unit, quantity]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const res = await placeOrder({
        data: {
          item,
          combo,
          quantity,
          locationSlug,
          customerName: name,
          customerPhone: phone,
          notes,
        },
      });
      setResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="bg-ink pb-20 pt-10 text-white">
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <p className="display text-center text-[12px] tracking-[0.22em] text-gold">
          Pickup Ordering
        </p>
        <h1 className="display mt-2 text-center text-4xl tracking-[-0.01em] md:text-5xl">
          Order Ahead. <span className="text-gold">Pay at Pickup.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-[15px] leading-snug text-white/80">
          Smash burgers made fresh when you order. We'll have it hot and ready when you walk in.
        </p>

        {result ? (
          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-gold/30 bg-white/[0.03] p-8 text-center">
            <CheckCircle2 className="mx-auto size-12 text-gold" strokeWidth={1.5} />
            <h2 className="display mt-4 text-2xl text-gold">Order {result.orderNumber}</h2>
            <p className="mt-2 text-[15px] text-white/90">
              Thanks! Your order is in. Show this order number at the counter — total due at
              pickup is <span className="display text-gold">{formatPrice(result.total)}</span>.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-ink p-5 text-left text-[14px] leading-relaxed text-white/85">
              <p className="display text-[12px] tracking-[0.18em] text-gold">Pickup at</p>
              <p className="mt-1.5">{result.locationName}</p>
              <p>{result.locationAddress}</p>
              <p className="mt-1">{result.locationPhone}</p>
            </div>
            <button
              type="button"
              onClick={() => setResult(null)}
              className="display mt-7 inline-flex h-11 items-center justify-center rounded-full border-[1.5px] border-gold px-8 text-[11px] tracking-[0.14em] text-gold transition hover:bg-gold hover:text-gold-foreground"
            >
              Place Another Order
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-8">
            {/* Item selection */}
            <div>
              <h2 className="display text-[13px] tracking-[0.18em] text-gold">1. Pick your smash</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {(Object.keys(ORDER_ITEMS) as OrderItemKey[]).map((key) => {
                  const it = ORDER_ITEMS[key];
                  const selected = item === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setItem(key)}
                      aria-pressed={selected}
                      className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-gold bg-gold/10"
                          : "border-white/15 bg-white/[0.03] hover:border-gold/50"
                      }`}
                    >
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                        <BrandImage slot={menuImage(it.name)} className="h-full" fill />
                      </div>
                      <div className="min-w-0">
                        <p className="display text-[14px] leading-tight text-white">{it.name}</p>
                        <p className="mt-1 text-[13px] text-white/70">
                          {key === "single"
                            ? "Single patty, American cheese, Gotham Sauce."
                            : "Double patties, American cheese, Gotham Sauce."}
                        </p>
                        <p className="display mt-1.5 text-[14px] text-gold">
                          {formatPrice(it.basePrice)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Combo + quantity */}
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <button
                  type="button"
                  onClick={() => setCombo((c) => !c)}
                  aria-pressed={combo}
                  className={`flex flex-1 items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left transition ${
                    combo
                      ? "border-gold bg-gold/10"
                      : "border-white/15 bg-white/[0.03] hover:border-gold/50"
                  }`}
                >
                  <span>
                    <span className="display block text-[13px] text-white">Make it a combo</span>
                    <span className="block text-[12.5px] text-white/70">
                      Gotham Regular Fries + your choice of Dirty Soda
                    </span>
                  </span>
                  <span className="display shrink-0 text-[13px] text-gold">
                    +{formatPrice(COMBO_UPCHARGE)}
                  </span>
                </button>

                <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/[0.03] px-5 py-4 sm:w-56">
                  <span className="display text-[13px] text-white">Quantity</span>
                  <span className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex size-8 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-gold hover:text-gold"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="display w-6 text-center text-[15px] text-gold">{quantity}</span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                      className="flex size-8 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-gold hover:text-gold"
                    >
                      <Plus className="size-4" />
                    </button>
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="display text-[13px] tracking-[0.18em] text-gold">2. Pickup location</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {OPEN_LOCATIONS.map((loc) => {
                  const selected = locationSlug === loc.slug;
                  const open = isOpenNow(loc);
                  return (
                    <button
                      key={loc.slug}
                      type="button"
                      onClick={() => setLocationSlug(loc.slug)}
                      aria-pressed={selected}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                        selected
                          ? "border-gold bg-gold/10"
                          : "border-white/15 bg-white/[0.03] hover:border-gold/50"
                      }`}
                    >
                      <MapPin className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.6} />
                      <span>
                        <span className="display block text-[13px] text-white">{loc.shortName}</span>
                        <span className="block text-[12.5px] text-white/70">
                          {loc.street}, {loc.city}
                        </span>
                        <span className={`mt-0.5 block text-[11.5px] ${open ? "text-gold" : "text-white/60"}`}>
                          {open ? "Open now" : "Currently closed — order for next opening"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="display text-[13px] tracking-[0.18em] text-gold">3. Your details</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="display text-[11px] tracking-[0.14em] text-white/70">Name</span>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={120}
                    placeholder="Name for the order"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="display text-[11px] tracking-[0.14em] text-white/70">Phone</span>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    maxLength={30}
                    placeholder="(585) 555-0123"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="display text-[11px] tracking-[0.14em] text-white/70">
                    Notes (optional)
                  </span>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={500}
                    rows={2}
                    placeholder="No pickles, extra Gotham Sauce, dirty soda flavor…"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-[14px] text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
                  />
                </label>
              </div>
            </div>

            {error && (
              <p className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-[13.5px] text-red-200">
                {error}
              </p>
            )}

            <div className="flex flex-col items-center gap-3 rounded-3xl border border-gold/30 bg-white/[0.03] p-6 sm:flex-row sm:justify-between">
              <p className="text-[14px] text-white/85">
                Total due at pickup:{" "}
                <span className="display text-xl text-gold">{formatPrice(total)}</span>
              </p>
              <button
                type="submit"
                disabled={pending}
                className="display inline-flex h-12 items-center justify-center rounded-full bg-gold px-10 text-[12px] tracking-[0.16em] text-gold-foreground transition hover:opacity-90 disabled:opacity-50"
              >
                {pending ? "Placing order…" : "Place Pickup Order"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
