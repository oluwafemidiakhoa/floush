import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { ensureOpsSchema } from "@/lib/ops-schema";

type ConvertPayload = {
  rate?: number | string;
  loadedMiles?: number | string;
  deadheadMiles?: number | string;
};

function asNonNegativeNumber(value: unknown) {
  if (value === "" || value == null) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  let body: ConvertPayload = {};

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rate = asNonNegativeNumber(body.rate);
  const loadedMiles = asNonNegativeNumber(body.loadedMiles);
  const deadheadMiles = asNonNegativeNumber(body.deadheadMiles);

  if (rate == null || rate <= 0) {
    return NextResponse.json({ error: "Enter the agreed freight rate before creating a load." }, { status: 400 });
  }

  try {
    await ensureOpsSchema();
    const sql = getSql();

    const quoteRows = await sql`
      SELECT id, company, contact_name, email, phone, pickup_location, delivery_location,
             pickup_date, equipment_type, freight_details, status
      FROM quote_requests
      WHERE id = ${id}
      LIMIT 1
    `;

    const quote = quoteRows[0];
    if (!quote) return NextResponse.json({ error: "Quote request not found." }, { status: 404 });

    const existingLoad = await sql`
      SELECT load_number FROM loads WHERE quote_request_id = ${id} LIMIT 1
    `;

    if (existingLoad[0]) {
      return NextResponse.json({
        ok: true,
        loadNumber: String(existingLoad[0].load_number),
        alreadyConverted: true,
      });
    }

    let customerId: string;
    const customerRows = await sql`
      SELECT id FROM customers
      WHERE LOWER(email) = LOWER(${String(quote.email)})
      ORDER BY created_at ASC
      LIMIT 1
    `;

    if (customerRows[0]) {
      customerId = String(customerRows[0].id);
      await sql`
        UPDATE customers
        SET name = ${String(quote.company)}, phone = ${String(quote.phone)}, updated_at = NOW()
        WHERE id = ${customerId}
      `;
    } else {
      const insertedCustomer = await sql`
        INSERT INTO customers (name, email, phone)
        VALUES (${String(quote.company)}, ${String(quote.email)}, ${String(quote.phone)})
        RETURNING id
      `;
      customerId = String(insertedCustomer[0].id);
    }

    const sequenceRows = await sql`SELECT nextval('floush_load_number_seq') AS value`;
    const sequence = Number(sequenceRows[0]?.value ?? 0);
    const year = new Date().getUTCFullYear();
    const loadNumber = `FL-${year}-${String(sequence).padStart(5, "0")}`;
    const revenueCents = Math.round(rate * 100);

    await sql`
      INSERT INTO loads (
        load_number, quote_request_id, customer_id,
        pickup_location, delivery_location, pickup_at,
        equipment_type, freight_details, revenue_cents,
        loaded_miles, deadhead_miles, status
      ) VALUES (
        ${loadNumber}, ${id}, ${customerId},
        ${String(quote.pickup_location)}, ${String(quote.delivery_location)}, ${String(quote.pickup_date)},
        ${String(quote.equipment_type)}, ${String(quote.freight_details)}, ${revenueCents},
        ${loadedMiles}, ${deadheadMiles}, 'booked'
      )
    `;

    await sql`
      UPDATE quote_requests
      SET status = 'won', updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true, loadNumber, alreadyConverted: false });
  } catch (error) {
    console.error("Quote conversion failed:", error);
    return NextResponse.json({ error: "The quote could not be converted to a load." }, { status: 500 });
  }
}
