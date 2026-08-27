import { z } from "zod";

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  birthdayMonth: z.coerce.number().int().min(1).max(12).nullable().optional(),
  birthdayDay: z.coerce.number().int().min(1).max(31).nullable().optional(),
});

export const preferencesSchema = z.object({
  smsOptIn: z.boolean(),
  emailOptIn: z.boolean(),
});

export const customerFiltersSchema = z.object({
  search: z.string().trim().max(120).optional().or(z.literal("")),
  optIn: z.enum(["all", "sms", "email", "both", "none"]).default("all"),
  source: z.string().trim().max(60).optional().or(z.literal("")),
});

/** Exact TCPA disclosure that must appear directly above the SMS checkbox. */
export const SMS_CONSENT_DISCLOSURE =
  "By checking this box you agree to receive recurring marketing text messages from Gotham Halal at the number provided. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe, HELP for help.";

export const EMAIL_CONSENT_DISCLOSURE =
  "By checking this box you agree to receive marketing emails from Gotham Halal. Every email includes an unsubscribe link and our mailing address. You can opt out at any time.";

export const BUSINESS_MAILING_ADDRESS = "Gotham Halal, 2534 W Ridge Rd, Rochester, NY 14626";
