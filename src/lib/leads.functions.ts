import { createServerFn } from "@tanstack/react-start";
import {
  cateringLeadSchema,
  franchiseInquirySchema,
  jobApplicationSchema,
  openingSignupSchema,
  textClubSchema,
} from "./leads.schemas";

async function requestMeta() {
  const { getRequestHeader } = await import("@tanstack/react-start/server");
  const forwarded = getRequestHeader("x-forwarded-for") ?? "";
  return {
    ip: forwarded.split(",")[0]?.trim() || getRequestHeader("cf-connecting-ip") || null,
    userAgent: getRequestHeader("user-agent") ?? null,
  };
}

async function syncToGhl(input: {
  firstName?: string | null;
  lastName?: string | null;
  fullName?: string | null;
  email?: string | null;
  phone: string;
  source: string;
  tags: string[];
  customFields?: Record<string, string | number | boolean | null>;
}) {
  try {
    const { upsertGhlContact } = await import("./ghl.server");
    const first = (input.firstName ?? input.fullName?.split(" ")[0]) || null;
    const last = (input.lastName ?? input.fullName?.split(" ").slice(1).join(" ")) || null;
    await upsertGhlContact({
      firstName: first,
      lastName: last,
      email: input.email,
      phone: input.phone,
      source: input.source,
      tags: input.tags,
      customFields: input.customFields,
    });
  } catch (error) {
    console.error("[ghl] sync failed", error);
  }
}

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
      signup_source: "opening_day",
    });
    if (error) {
      console.error("opening signup insert failed", error.message);
      throw new Error("We couldn't save your signup. Please try again.");
    }

    const { upsertCustomerFromSignup } = await import("./customers.server");
    const meta = await requestMeta();
    await upsertCustomerFromSignup({
      phone: data.phone,
      firstName: data.firstName,
      email: data.email || null,
      smsOptIn: data.smsOptIn,
      source: "opening_day",
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    void syncToGhl({
      firstName: data.firstName,
      email: data.email || null,
      phone: data.phone,
      source: "opening_day",
      tags: ["Opening Day", ...(data.smsOptIn ? ["Text Club"] : [])],
      customFields: {
        location: data.locationSlug,
        sms_opt_in: data.smsOptIn ? "Yes" : "No",
      },
    });

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

export const submitTextClub = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => textClubSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("opening_signups").insert({
      first_name: data.firstName,
      phone: data.phone,
      sms_opt_in: true,
      location_slug: null,
      signup_source: data.source,
    });
    if (error) {
      console.error("text club insert failed", error.message);
      throw new Error("We couldn't add you to the list. Please try again.");
    }

    const { upsertCustomerFromSignup } = await import("./customers.server");
    const meta = await requestMeta();
    await upsertCustomerFromSignup({
      phone: data.phone,
      firstName: data.firstName,
      smsOptIn: true,
      source: data.source,
      ip: meta.ip,
      userAgent: meta.userAgent,
    });

    const { notifyLead } = await import("./notify.server");
    await notifyLead("New text club signup", [
      `Name: ${data.firstName}`,
      `Phone: ${data.phone}`,
      `Source: ${data.source}`,
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

    if (data.smsOptIn) {
      const { error: smsError } = await supabaseAdmin.from("opening_signups").insert({
        first_name: data.fullName.split(" ")[0] ?? data.fullName,
        phone: data.phone,
        email: data.email,
        sms_opt_in: true,
        location_slug: null,
        signup_source: "catering",
      });
      if (smsError) console.error("catering text club insert failed", smsError.message);
    }

    {
      const { upsertCustomerFromSignup } = await import("./customers.server");
      const meta = await requestMeta();
      await upsertCustomerFromSignup({
        phone: data.phone,
        firstName: data.fullName.split(" ")[0] ?? data.fullName,
        email: data.email,
        smsOptIn: data.smsOptIn,
        source: "catering",
        ip: meta.ip,
        userAgent: meta.userAgent,
      });
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
      `Text club opt-in: ${data.smsOptIn ? "Yes" : "No"}`,
    ]);

    return { ok: true as const };
  });

export const submitJobApplication = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => jobApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("job_applications").insert({
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      position: data.position,
      preferred_location: data.preferredLocation,
      availability: data.availability,
      has_experience: data.hasExperience,
      experience_details: data.hasExperience ? data.experienceDetails || null : null,
      is_adult: data.isAdult,
      notes: data.notes || null,
      sms_opt_in: data.smsOptIn,
    });
    if (error) {
      console.error("job application insert failed", error.message);
      throw new Error("We couldn't send your application. Please try again.");
    }

    if (data.smsOptIn) {
      const { error: smsError } = await supabaseAdmin.from("opening_signups").insert({
        first_name: data.fullName.split(" ")[0] ?? data.fullName,
        phone: data.phone,
        email: data.email,
        sms_opt_in: true,
        location_slug: null,
        signup_source: "careers",
      });
      if (smsError) console.error("careers text club insert failed", smsError.message);
    }

    {
      const { upsertCustomerFromSignup } = await import("./customers.server");
      const meta = await requestMeta();
      await upsertCustomerFromSignup({
        phone: data.phone,
        firstName: data.fullName.split(" ")[0] ?? data.fullName,
        email: data.email,
        smsOptIn: data.smsOptIn,
        source: "careers",
        ip: meta.ip,
        userAgent: meta.userAgent,
      });
    }

    const { notifyLead } = await import("./notify.server");
    await notifyLead("New job application", [
      `Name: ${data.fullName}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Position: ${data.position}`,
      `Preferred location: ${data.preferredLocation}`,
      `Availability: ${data.availability.join(", ") || "—"}`,
      `Food service experience: ${data.hasExperience ? "Yes" : "No"}`,
      `Where: ${data.hasExperience ? data.experienceDetails || "—" : "—"}`,
      `18 or older: ${data.isAdult ? "Yes" : "No"}`,
      `Notes: ${data.notes || "—"}`,
      `Text club opt-in: ${data.smsOptIn ? "Yes" : "No"}`,
    ]);

    return { ok: true as const };
  });

export const submitFranchiseInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => franchiseInquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("franchise_inquiries").insert({
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      market: data.market,
      capital: data.capital,
      has_ownership_experience: data.hasOwnershipExperience,
      experience_details: data.hasOwnershipExperience ? data.experienceDetails || null : null,
      locations_interest: data.locationsInterest,
      timeline: data.timeline,
      notes: data.notes || null,
    });
    if (error) {
      console.error("franchise inquiry insert failed", error.message);
      throw new Error("We couldn't send your inquiry. Please try again.");
    }

    const { notifyLead } = await import("./notify.server");
    await notifyLead("New franchise inquiry", [
      `Name: ${data.fullName}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      `Market: ${data.market}`,
      `Capital: ${data.capital}`,
      `Ownership experience: ${data.hasOwnershipExperience ? "Yes" : "No"}`,
      `Details: ${data.hasOwnershipExperience ? data.experienceDetails || "—" : "—"}`,
      `Locations of interest: ${data.locationsInterest}`,
      `Timeline: ${data.timeline}`,
      `Notes: ${data.notes || "—"}`,
    ]);

    return { ok: true as const };
  });
