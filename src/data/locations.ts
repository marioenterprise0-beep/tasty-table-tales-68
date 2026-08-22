import { ORDER_URL } from "@/lib/order";

export type DayHours = { open: string; close: string } | null;

/** Hours are indexed Sunday (0) → Saturday (6). Edit freely — layout adapts. */
export type WeekHours = [DayHours, DayHours, DayHours, DayHours, DayHours, DayHours, DayHours];

export type Location = {
  slug: string;
  name: string;
  shortName: string;
  street: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string;
  status: "open" | "opening_soon";
  offers?: string[];
  orderUrl?: string;
  /** Verified pin coordinates. Never derived from the address string. */
  lat: number;
  lng: number;
  placeId?: string;
  /** Short "how to find us" note shown under the address when present. */
  findingNote?: string;
  directionsUrl: string;
  /** ISO date, e.g. "2026-10-01". Leave null until the date is confirmed. */
  openingDate?: string | null;
  hours: WeekHours;
};

/** West Ridge: 11AM–12AM daily, except Friday which opens at 4PM. */
const WEST_RIDGE_HOURS: WeekHours = [
  { open: "11:00", close: "24:00" }, // Sun
  { open: "11:00", close: "24:00" }, // Mon
  { open: "11:00", close: "24:00" }, // Tue
  { open: "11:00", close: "24:00" }, // Wed
  { open: "11:00", close: "24:00" }, // Thu
  { open: "16:00", close: "24:00" }, // Fri
  { open: "11:00", close: "24:00" }, // Sat
];

/** Jefferson Road opening hours: 4PM–12AM every day. */
const JEFFERSON_HOURS: WeekHours = [
  { open: "16:00", close: "24:00" },
  { open: "16:00", close: "24:00" },
  { open: "16:00", close: "24:00" },
  { open: "16:00", close: "24:00" },
  { open: "16:00", close: "24:00" },
  { open: "16:00", close: "24:00" },
  { open: "16:00", close: "24:00" },
];


/** Coordinate-based directions: address strings strand people at the road. */
export function directionsTo(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

export const LOCATIONS: Location[] = [
  {
    slug: "west-ridge",
    name: "Gotham Halal — West Ridge",
    shortName: "West Ridge",
    street: "2534 W Ridge Rd",
    city: "Rochester",
    region: "NY",
    postalCode: "14626",
    phone: "(585) 946-8426",
    status: "open",
    offers: ["Pickup", "Delivery"],
    orderUrl: ORDER_URL,
    lat: 43.2102859,
    lng: -77.6954758,
    placeId: "ChIJHYAgjryx1okRpv-FZaU48Ik",
    findingNote: "",
    directionsUrl: directionsTo(43.2102859, -77.6954758),
    hours: WEST_RIDGE_HOURS,
  },
  {
    slug: "jefferson-road",
    name: "Gotham Halal — Jefferson Road",
    shortName: "Jefferson Road",
    street: "900 Jefferson Rd",
    city: "Rochester",
    region: "NY",
    postalCode: "14623",
    phone: "(585) 946-8426",
    status: "opening_soon",
    // TODO: set the confirmed opening date to switch on the countdown.
    openingDate: null,
    lat: 43.088514,
    lng: -77.611357,
    findingNote:
      "Set back from Jefferson Rd, behind the storage lot. Look for the Gotham signage.",
    directionsUrl: directionsTo(43.088514, -77.611357),
    hours: JEFFERSON_HOURS,
  },
];

export const DAY_LABELS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function fullAddress(l: Location) {
  return `${l.street}, ${l.city}, ${l.region} ${l.postalCode}`;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const normalized = h % 24; // 24:00 => midnight
  const suffix = normalized >= 12 ? "PM" : "AM";
  const hour = normalized % 12 === 0 ? 12 : normalized % 12;
  return m === 0 ? `${hour}${suffix}` : `${hour}:${String(m).padStart(2, "0")}${suffix}`;
}

export function todayHours(l: Location, now = new Date()): DayHours {
  return l.hours[now.getDay()];
}

export function hoursLabel(hours: DayHours) {
  if (!hours) return "Closed today";
  return `${formatTime(hours.open)} – ${formatTime(hours.close)}`;
}

/**
 * Minutes since midnight for a day's close time. A close that is at or before
 * the open time (e.g. "00:00" or "02:00") belongs to the FOLLOWING day, so it
 * is returned as 24:00+ of the same day.
 */
function closeMinutes(hours: NonNullable<DayHours>) {
  const open = toMinutes(hours.open);
  const close = toMinutes(hours.close);
  return close <= open ? close + 1440 : close;
}

export function isOpenNow(l: Location, now = new Date()) {
  const minutes = now.getHours() * 60 + now.getMinutes();

  // Today's shift.
  const today = todayHours(l, now);
  if (today && minutes >= toMinutes(today.open) && minutes < closeMinutes(today)) return true;

  // Yesterday's shift may still be running past midnight.
  const yesterday = l.hours[(now.getDay() + 6) % 7];
  if (yesterday && closeMinutes(yesterday) > 1440 && minutes < closeMinutes(yesterday) - 1440) {
    return true;
  }

  return false;
}


/** Whole days until the opening date, or null when no date is set. */
export function daysUntilOpening(l: Location, now = new Date()): number | null {
  if (!l.openingDate) return null;
  const target = new Date(`${l.openingDate}T00:00:00`);
  const diff = target.getTime() - now.getTime();
  if (Number.isNaN(diff)) return null;
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export const OPEN_LOCATIONS = LOCATIONS.filter((l) => l.status === "open");
