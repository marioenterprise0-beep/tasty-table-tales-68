import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(30, "Phone number is too long");

const openingSignupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  phone,
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  smsOptIn: z.boolean(),
  locationSlug: z.string().trim().min(1).max(60),
});

const cateringLeadSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(120),
  phone,
  email: z.string().trim().email("Enter a valid email").max(255),
  eventDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose an event date"),
  headcount: z.coerce.number().int().min(1, "Headcount must be at least 1").max(100000),
  eventType: z.enum(["Office Lunch", "Party", "Wedding", "Corporate Event", "Other"]),
  eventLocation: z.string().trim().max(300).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const submitOpeningSignup = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => openingSignupSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("opening_signups").insert({
      first_name: data.firstName,
      phone: data.phone,
      email: data.email || null,
      sms_opt_in: data.smsOptIn,
      location_slug: data.locationSlug,
    });
    if (error) {
      console.error("opening signup insert failed", error.message);
      throw new Error("We couldn't save your signup. Please try again.");
    }

    const { notifyLead } = await import("./notify.server");
    await notifyLead("New opening day signup", [
      `Name: ${data.firstName}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email || "—"}`,
      `Text me when it opens: ${data.smsOptIn ? "Yes" : "No"}`,
      `Location: ${data.locationSlug}`,
    ]);

    return { ok: true as const };
  });

export const submitCateringLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => cateringLeadSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("catering_leads").insert({
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      event_date: data.eventDate,
      headcount: data.headcount,
      event_type: data.eventType,
      event_location: data.eventLocation || null,
      notes: data.notes || null,
    });
    if (error) {
      console.error("catering lead insert failed", error.message);
      throw new Error("We couldn't send your request. Please try again.");
    }

    const { notifyLead } = await import("./notify.server");
    await notifyLead("New catering request", [
      `Name: ${data.fullName}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Event date: ${data.eventDate}`,
      `Headcount: ${data.headcount}`,
      `Event type: ${data.eventType}`,
      `Location: ${data.eventLocation || "—"}`,
      `Notes: ${data.notes || "—"}`,
    ]);

    return { ok: true as const };
  });
