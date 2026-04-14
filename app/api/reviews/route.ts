import { NextResponse } from "next/server";
import { getDb, sql } from "@/lib/db";

// GET /api/reviews?productId=1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID required" },
        { status: 400 },
      );
    }

    const pool = await getDb();
    const result = await pool.request().input("productId", sql.Int, productId)
      .query(`
        SELECT r.*, u.FullName as UserName
        FROM Reviews r
        JOIN Users u ON r.UserId = u.Id
        WHERE r.ProductId = @productId
        ORDER BY r.CreatedAt DESC
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

// POST /api/reviews
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, rating, comment } = body;

    if (!userId || !productId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const pool = await getDb();

    // Insert review
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("productId", sql.Int, productId)
      .input("rating", sql.Int, rating)
      .input("comment", sql.NVarChar, comment)
      .query(
        "INSERT INTO Reviews (UserId, ProductId, Rating, Comment) VALUES (@userId, @productId, @rating, @comment)",
      );

    // Update product rating and review count
    await pool.request().input("productId", sql.Int, productId).query(`
        UPDATE Products 
        SET Rating = (SELECT AVG(CAST(Rating AS DECIMAL(3,2))) FROM Reviews WHERE ProductId = @productId),
            ReviewCount = (SELECT COUNT(*) FROM Reviews WHERE ProductId = @productId)
        WHERE Id = @productId
      `);

    return NextResponse.json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
