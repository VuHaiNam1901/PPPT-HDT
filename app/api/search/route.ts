import { NextResponse } from "next/server";
import { getDb, sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json([]);
    }

    const pool = await getDb();
    const result = await pool
      .request()
      .input("query", sql.NVarChar, `%${query}%`).query(`
        SELECT TOP 10 Id, Name, Slug, Image, Price, Rating
        FROM Products
        WHERE Name LIKE @query OR Description LIKE @query
        ORDER BY Rating DESC
      `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
