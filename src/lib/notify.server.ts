/** Where website leads are emailed. */
export const LEAD_EMAIL = "hello@gothamhalal.com";

/**
 * Emails a lead notification via Resend when RESEND_API_KEY is configured.
 * Leads are always stored in the database first, so a missing key or a
 * provider outage never loses a submission.
 */
export async function notifyLead(subject: string, lines: string[]) {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.warn(`[lead] ${subject} stored; email skipped (RESEND_API_KEY not set)`);
    return;
  }

  const from = process.env["LEAD_FROM_EMAIL"] ?? "Gotham Halal <onboarding@resend.dev>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [LEAD_EMAIL],
        subject: `${subject} — gothamhalal.com`,
        text: lines.join("\n"),
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Resend request failed [${response.status}]: ${body}`);
    }
  } catch (error) {
    console.error("Resend request threw", error);
  }
}

/** Sends a transactional (non-marketing) email to a customer. */
export async function sendCustomerEmail(to: string, subject: string, lines: string[]) {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    console.warn(`[customer email] ${subject} skipped (RESEND_API_KEY not set)`);
    return false;
  }
  const from = process.env["LEAD_FROM_EMAIL"] ?? "Gotham Halal <onboarding@resend.dev>";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, text: lines.join("\n") }),
    });
    if (!response.ok) {
      console.error(`Resend customer email failed [${response.status}]`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Resend customer email threw", error);
    return false;
  }
}
