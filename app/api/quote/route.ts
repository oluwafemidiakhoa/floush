import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSql } from "@/lib/db";

type QuotePayload = {
  company?: string;
  contact?: string;
  email?: string;
  phone?: string;
  pickup?: string;
  delivery?: string;
  pickupDate?: string;
  equipment?: string;
  details?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(request: Request) {
  let body: QuotePayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const quote = {
    company: text(body.company),
    contact: text(body.contact),
    email: text(body.email),
    phone: text(body.phone),
    pickup: text(body.pickup),
    delivery: text(body.delivery),
    pickupDate: text(body.pickupDate),
    equipment: text(body.equipment),
    details: text(body.details),
  };

  const required = Object.entries(quote)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (required.length) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!EMAIL_RE.test(quote.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  let quoteId: string;

  try {
    const sql = getSql();
    const rows = await sql`
      INSERT INTO quote_requests (
        company,
        contact_name,
        email,
        phone,
        pickup_location,
        delivery_location,
        pickup_date,
        equipment_type,
        freight_details
      ) VALUES (
        ${quote.company},
        ${quote.contact},
        ${quote.email},
        ${quote.phone},
        ${quote.pickup},
        ${quote.delivery},
        ${quote.pickupDate},
        ${quote.equipment},
        ${quote.details}
      )
      RETURNING id
    `;

    quoteId = String(rows[0]?.id ?? "");

    if (!quoteId) {
      throw new Error("Quote record was not created.");
    }
  } catch (error) {
    console.error("Quote persistence failed:", error);
    return NextResponse.json(
      { error: "We could not save your quote request. Please try again shortly." },
      { status: 503 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    try {
      const sql = getSql();
      await sql`
        UPDATE quote_requests
        SET email_notification_status = 'not_configured', updated_at = NOW()
        WHERE id = ${quoteId}
      `;
    } catch (error) {
      console.error("Quote email status update failed:", error);
    }

    return NextResponse.json({ ok: true, id: quoteId, notification: "not_configured" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.QUOTE_NOTIFICATION_EMAIL || "operations@floushfreight.com";
  const from = process.env.QUOTE_FROM_EMAIL || "Floush Logistics <onboarding@resend.dev>";

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: quote.email,
    subject: `New freight quote: ${quote.pickup} → ${quote.delivery}`,
    html: `
      <h2>New Floush Logistics quote request</h2>
      <p><strong>Quote ID:</strong> ${escapeHtml(quoteId)}</p>
      <p><strong>Company:</strong> ${escapeHtml(quote.company)}</p>
      <p><strong>Contact:</strong> ${escapeHtml(quote.contact)}</p>
      <p><strong>Email:</strong> ${escapeHtml(quote.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(quote.phone)}</p>
      <p><strong>Pickup:</strong> ${escapeHtml(quote.pickup)}</p>
      <p><strong>Delivery:</strong> ${escapeHtml(quote.delivery)}</p>
      <p><strong>Pickup date:</strong> ${escapeHtml(quote.pickupDate)}</p>
      <p><strong>Equipment:</strong> ${escapeHtml(quote.equipment)}</p>
      <p><strong>Freight details:</strong><br>${escapeHtml(quote.details).replaceAll("\n", "<br>")}</p>
    `,
  });

  try {
    const sql = getSql();

    if (error) {
      await sql`
        UPDATE quote_requests
        SET
          email_notification_status = 'failed',
          email_notification_error = ${String(error.message || "Unknown email error")},
          updated_at = NOW()
        WHERE id = ${quoteId}
      `;
    } else {
      await sql`
        UPDATE quote_requests
        SET
          email_notification_status = 'sent',
          email_notification_error = NULL,
          updated_at = NOW()
        WHERE id = ${quoteId}
      `;
    }
  } catch (statusError) {
    console.error("Quote notification status update failed:", statusError);
  }

  if (error) {
    console.error("Quote notification failed:", error);
    return NextResponse.json({ ok: true, id: quoteId, notification: "failed" });
  }

  return NextResponse.json({ ok: true, id: quoteId, notification: "sent" });
}
