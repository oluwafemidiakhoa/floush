import { getSql } from "@/lib/db";

let schemaPromise: Promise<void> | null = null;

async function initializeQuoteSchema() {
  const sql = getSql();

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await sql`
    CREATE TABLE IF NOT EXISTS quote_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company TEXT NOT NULL,
      contact_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      pickup_location TEXT NOT NULL,
      delivery_location TEXT NOT NULL,
      pickup_date DATE NOT NULL,
      equipment_type TEXT NOT NULL,
      freight_details TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'quoted', 'won', 'lost', 'archived')),
      email_notification_status TEXT NOT NULL DEFAULT 'pending' CHECK (email_notification_status IN ('pending', 'sent', 'failed', 'not_configured')),
      email_notification_error TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests (status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests (LOWER(email))`;
}

export function ensureQuoteSchema() {
  if (!schemaPromise) {
    schemaPromise = initializeQuoteSchema().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }

  return schemaPromise;
}
