import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { ensureQuoteSchema } from "@/lib/quote-schema";
import { ensureOpsSchema } from "@/lib/ops-schema";

export async function GET() {
  const configured = Boolean(process.env.DATABASE_URL);

  try {
    await Promise.all([ensureQuoteSchema(), ensureOpsSchema()]);
    const sql = getSql();
    await sql`SELECT 1 AS ok`;

    return NextResponse.json({
      ok: true,
      configured,
      database: "connected",
      schema: "ready",
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      {
        ok: false,
        configured,
        database: "unavailable",
        schema: "unknown",
      },
      { status: 503 },
    );
  }
}
