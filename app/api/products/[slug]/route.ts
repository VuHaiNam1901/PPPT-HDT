import { NextResponse } from "next/server";
import { getDb, sql } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const pool = await getDb();
    const result = await pool.request().input("slug", sql.NVarChar, params.slug)
      .query(`
        SELECT p.*, c.Name as CategoryName 
        FROM Products p 
        LEFT JOIN Categories c ON p.CategoryId = c.Id 
        WHERE p.Slug = @slug
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
