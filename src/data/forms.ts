/** Shared option lists for the careers and franchise forms. */

export const POSITIONS = [
  "Grill / Line Cook",
  "Cashier / Front Counter",
  "Food Trailer Crew",
  "Shift Lead",
  "Delivery Driver",
  "Not Sure — Open to Anything",
] as const;

export const PREFERRED_LOCATIONS = ["West Ridge", "Jefferson Road", "Either"] as const;

export const AVAILABILITY = [
  "Weekday Mornings",
  "Weekday Afternoons",
  "Weekday Evenings",
  "Weekend Mornings",
  "Weekend Afternoons",
  "Weekend Evenings",
  "Late Night",
] as const;

export const CAPITAL_RANGES = [
  "Under $150k",
  "$150k–$300k",
  "$300k–$500k",
  "$500k+",
  "Prefer not to say",
] as const;

export const LOCATION_COUNTS = ["1", "2–3", "4+", "Not sure yet"] as const;

export const TIMELINES = ["Ready now", "3–6 months", "6–12 months", "Just exploring"] as const;

/** Required small print under every phone field. */
export const SMS_DISCLAIMER = "Message and data rates may apply. Reply STOP to opt out.";

/** Copy shown after a successful text club signup. */
export const TEXT_CLUB_CONFIRMATION = "You're in. Keep an eye on your phone.";
