import * as React from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Clock, Phone } from "lucide-react";
import {
  LOCATIONS,
  fullAddress,
  hoursLabel,
  isOpenNow,
  todayHours,
  daysUntilOpening,
  type Location,
} from "@/data/locations";
import { OrderLink } from "./OrderLink";
import { useOpeningSignup } from "./OpeningSignup";

/** Client-side clock so open/closed never mismatches the server render. */
function useNow() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function LocationsBlock({ heading = "Where We're At" }: { heading?: string }) {
  const now = useNow();

  return (
    <section className="bg-ink" aria-labelledby="where-were-at">
      <div className="mx-auto max-w-[1500px] px-5 py-12 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="where-were-at" className="display text-2xl tracking-[0.01em] text-gold md:text-[34px]">
            {heading}
          </h2>
          <Link to="/locations" className="display text-[11px] tracking-[0.16em] text-white/70 underline-offset-4 hover:text-gold hover:underline">
            View All Locations
          </Link>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          {LOCATIONS.map((l) => (
            <LocationCard key={l.slug} location={l} now={now} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function LocationCard({ location, now }: { location: Location; now: Date | null }) {
  const { open } = useOpeningSignup();
  const isSoon = location.status === "opening_soon";
  const openNow = now ? isOpenNow(location, now) : null;
  const days = now ? daysUntilOpening(location, now) : null;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-gold/25 bg-white/[0.03] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="display min-w-0 text-lg leading-tight text-white">{location.name}</h3>
        {isSoon ? (
          <span className="display shrink-0 rounded-full bg-gold px-3 py-1 text-[10px] tracking-[0.16em] text-gold-foreground">
            Opening Soon
          </span>
        ) : (
          openNow !== null && (
            <span
              className={`display shrink-0 rounded-full border px-3 py-1 text-[10px] tracking-[0.16em] ${
                openNow ? "border-gold text-gold" : "border-white/30 text-white/60"
              }`}
            >
              {openNow ? "Open Now" : "Closed"}
            </span>
          )
        )}
      </div>

      <p className="mt-3 flex items-start gap-2 text-sm text-white/80">
        <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
        <span className="min-w-0 break-words">{fullAddress(location)}</span>
      </p>

      {location.findingNote ? (
        <p className="mt-1.5 pl-6 text-[12.5px] leading-snug text-gold">{location.findingNote}</p>
      ) : null}

      <p className="mt-2 flex items-start gap-2 text-sm text-white/80">
        <Clock className="mt-0.5 size-4 shrink-0 text-gold" />
        <span>
          {isSoon ? "Opening hours: " : "Today: "}
          {hoursLabel(todayHours(location, now ?? new Date()))}
        </span>
      </p>

      <p className="mt-2 flex items-start gap-2 text-sm text-white/80">
        <Phone className="mt-0.5 size-4 shrink-0 text-gold" />
        <a href={`tel:${location.phone.replace(/[^\d+]/g, "")}`} className="hover:text-gold">
          {location.phone}
        </a>
      </p>

      {!isSoon && location.offers?.length ? (
        <p className="display mt-3 text-[10px] tracking-[0.16em] text-white/50">
          {location.offers.join(" · ")}
        </p>
      ) : null}


      {isSoon && days !== null && (
        <p className="display mt-3 text-[11px] tracking-[0.16em] text-gold">
          {days === 0 ? "Opening today" : `${days} day${days === 1 ? "" : "s"} to go`}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3 pt-2 [margin-top:auto]">
        {isSoon ? (
          <>
            <button type="button" onClick={open} className="pill-gold px-6 py-2.5 text-[11px]">
              Get Opening Day Alerts
            </button>
            <a
              href={location.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="pill-outline px-6 py-2.5 text-[11px]"
            >
              Get Directions
            </a>
          </>
        ) : (
          <>
            <OrderLink content={`location_${location.slug}`} className="pill-gold px-6 py-2.5 text-[11px]">
              Order From Here
            </OrderLink>
            <a
              href={location.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="pill-outline px-6 py-2.5 text-[11px]"
            >
              Get Directions
            </a>
          </>
        )}
      </div>
    </article>
  );
}

export { useNow };
