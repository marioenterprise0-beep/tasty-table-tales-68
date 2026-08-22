import { z } from "zod";
import {
  AVAILABILITY,
  CAPITAL_RANGES,
  LOCATION_COUNTS,
  POSITIONS,
  PREFERRED_LOCATIONS,
  TIMELINES,
} from "@/data/forms";

export const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(30, "Phone number is too long");

export const openingSignupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  phone,
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  smsOptIn: z.boolean(),
  locationSlug: z.string().trim().min(1).max(60),
});

export const textClubSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  phone,
  source: z.enum(["text_club", "careers", "catering"]).default("text_club"),
});

export const cateringLeadSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  phone,
  email: z.string().trim().email("Enter a valid email").max(255),
  eventDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose an event date"),
  headcount: z.coerce.number().int().min(1, "Headcount must be at least 1").max(100000),
  eventType: z.enum(["Office Lunch", "Party", "Wedding", "Corporate Event", "Other"]),
  eventLocation: z.string().trim().max(300).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  smsOptIn: z.boolean().optional().default(false),
});

export const jobApplicationSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  phone,
  email: z.string().trim().email("Enter a valid email").max(255),
  position: z.enum(POSITIONS),
  preferredLocation: z.enum(PREFERRED_LOCATIONS),
  availability: z.array(z.enum(AVAILABILITY)).max(AVAILABILITY.length).default([]),
  hasExperience: z.boolean(),
  experienceDetails: z.string().trim().max(500).optional().or(z.literal("")),
  isAdult: z.boolean(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  smsOptIn: z.boolean().optional().default(false),
});

export const franchiseInquirySchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  phone,
  email: z.string().trim().email("Enter a valid email").max(255),
  market: z.string().trim().min(1, "Tell us the city or market").max(160),
  capital: z.enum(CAPITAL_RANGES),
  hasOwnershipExperience: z.boolean(),
  experienceDetails: z.string().trim().max(2000).optional().or(z.literal("")),
  locationsInterest: z.enum(LOCATION_COUNTS),
  timeline: z.enum(TIMELINES),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});
