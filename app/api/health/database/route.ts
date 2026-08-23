import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { ensureQuoteSchema } from "@/lib/quote-schema";
import { ensureOpsSchema } from "@/lib/ops-schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const configured = Boolean(process.env.DATABASE_URL);

  if (!configured) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        database: "not_configured",
        stage: "configuration",
        quoteSchema: "unknown",
        opsSchema: "unknown",
      },
      { status: 503 },
    );
  }

  const sql = getSql();

  try {
    await sql`SELECT 1 AS ok`;
  } catch (error) {
    console.error("Database connection health check failed:", error);
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        database: "unavailable",
        stage: "connection",
        quoteSchema: "unknown",
        opsSchema: "unknown",
      },
      { status: 503 },
    );
  }

  try {
    await ensureQuoteSchema();
  } catch (error) {
    console.error("Quote schema health check failed:", error);
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        database: "connected",
        stage: "quote_schema",
        quoteSchema: "failed",
        opsSchema: "unknown",
      },
      { status: 503 },
    );
  }

  try {
    await ensureOpsSchema();
  } catch (error) {
    console.error("Operations schema health check failed:", error);
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        database: "connected",
        stage: "ops_schema",
        quoteSchema: "ready",
        opsSchema: "failed",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    configured: true,
    database: "connected",
    stage: "ready",
    quoteSchema: "ready",
    opsSchema: "ready",
  });
}
