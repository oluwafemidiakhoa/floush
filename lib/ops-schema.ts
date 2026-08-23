import { getSql } from "@/lib/db";

let schemaPromise: Promise<void> | null = null;

async function initializeOpsSchema() {
  const sql = getSql();

  await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

  await sql`
    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS brokers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      mc_number TEXT,
      email TEXT,
      phone TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS drivers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      license_number TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','on_leave')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS trucks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      unit_number TEXT NOT NULL UNIQUE,
      vin TEXT,
      year INTEGER,
      make TEXT,
      model TEXT,
      status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','assigned','maintenance','inactive')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS loads (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      load_number TEXT NOT NULL UNIQUE,
      customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
      broker_id UUID REFERENCES brokers(id) ON DELETE SET NULL,
      driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
      truck_id UUID REFERENCES trucks(id) ON DELETE SET NULL,
      pickup_location TEXT NOT NULL,
      delivery_location TEXT NOT NULL,
      pickup_at TIMESTAMPTZ,
      delivery_at TIMESTAMPTZ,
      revenue_cents INTEGER NOT NULL DEFAULT 0 CHECK (revenue_cents >= 0),
      loaded_miles NUMERIC(10,2),
      deadhead_miles NUMERIC(10,2),
      status TEXT NOT NULL DEFAULT 'booked' CHECK (status IN ('booked','dispatched','in_transit','delivered','invoiced','paid','cancelled')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS expenses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      load_id UUID REFERENCES loads(id) ON DELETE SET NULL,
      category TEXT NOT NULL,
      amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
      incurred_on DATE NOT NULL DEFAULT CURRENT_DATE,
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      load_id UUID REFERENCES loads(id) ON DELETE SET NULL,
      invoice_number TEXT NOT NULL UNIQUE,
      amount_cents INTEGER NOT NULL DEFAULT 0 CHECK (amount_cents >= 0),
      status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','partial','paid','void')),
      issued_on DATE,
      due_on DATE,
      paid_on DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_loads_status ON loads(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_loads_pickup_at ON loads(pickup_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_expenses_load_id ON expenses(load_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status)`;
}

export function ensureOpsSchema() {
  if (!schemaPromise) {
    schemaPromise = initializeOpsSchema().catch((error) => {
      schemaPromise = null;
      throw error;
    });
  }

  return schemaPromise;
}
