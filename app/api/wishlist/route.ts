import { NextResponse } from "next/server";
import { getDb, sql } from "@/lib/db";

// GET /api/wishlist?userId=1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const pool = await getDb();
    const result = await pool.request().input("userId", sql.Int, userId).query(`
        SELECT w.*, p.Name, p.Price, p.Image, p.Slug
        FROM Wishlist w
        JOIN Products p ON w.ProductId = p.Id
        WHERE w.UserId = @userId
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

// POST /api/wishlist (Toggle)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and Product ID required" },
        { status: 400 },
      );
    }

    const pool = await getDb();

    // Check if item already exists in wishlist
    const checkResult = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("productId", sql.Int, productId)
      .query(
        "SELECT Id FROM Wishlist WHERE UserId = @userId AND ProductId = @productId",
      );

    if (checkResult.recordset.length > 0) {
      // Remove
      await pool
        .request()
        .input("id", sql.Int, checkResult.recordset[0].Id)
        .query("DELETE FROM Wishlist WHERE Id = @id");
      return NextResponse.json({
        message: "Removed from wishlist",
        action: "removed",
      });
    } else {
      // Add
      await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("productId", sql.Int, productId)
        .query(
          "INSERT INTO Wishlist (UserId, ProductId) VALUES (@userId, @productId)",
        );
      return NextResponse.json({
        message: "Added to wishlist",
        action: "added",
      });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
