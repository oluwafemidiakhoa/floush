import { NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { ensureQuoteSchema } from "@/lib/quote-schema";
import { ensureOpsSchema } from "@/lib/ops-schema";

export async function GET() {
  try {
    await Promise.all([ensureQuoteSchema(), ensureOpsSchema()]);
    const sql = getSql();
    const rows = await sql`SELECT NOW() AS database_time`;

    return NextResponse.json({
      ok: true,
      database: "connected",
      schema: "ready",
      databaseTime: rows[0]?.database_time ?? null,
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      {
        ok: false,
        database: "unavailable",
        schema: "unknown",
        error: error instanceof Error ? error.message : "Unknown database error",
      },
      { status: 503 },
    );
  }
}
