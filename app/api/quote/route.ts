import { NextResponse } from "next/server";
import { Resend } from "resend";

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

  const required = Object.entries(quote).filter(([, value]) => !value).map(([key]) => key);
  if (required.length) {
    return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  }

  if (!EMAIL_RE.test(quote.email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    console.info("Quote request received (email delivery not configured):", quote);
    return NextResponse.json({ ok: true, delivery: "not-configured" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.QUOTE_NOTIFICATION_EMAIL || "operations@floushfreight.com";
  const from = process.env.QUOTE_FROM_EMAIL || "Floush Logistics <onboarding@resend.dev>";

  const escapeHtml = (value: string) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: quote.email,
    subject: `New freight quote: ${quote.pickup} → ${quote.delivery}`,
    html: `
      <h2>New Floush Logistics quote request</h2>
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

  if (error) {
    console.error("Quote delivery failed:", error);
    return NextResponse.json({ error: "Your request could not be delivered. Please try again shortly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
