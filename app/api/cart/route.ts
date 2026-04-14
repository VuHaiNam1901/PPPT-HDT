import { NextResponse } from "next/server";
import { getDb, sql } from "@/lib/db";

// GET /api/cart?userId=1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const pool = await getDb();
    const result = await pool.request().input("userId", sql.Int, userId).query(`
        SELECT c.*, p.Name, p.Price, p.Image, p.Slug
        FROM Cart c
        JOIN Products p ON c.ProductId = p.Id
        WHERE c.UserId = @userId
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

// POST /api/cart
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, quantity } = body;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "User ID and Product ID required" },
        { status: 400 },
      );
    }

    const pool = await getDb();

    // Check if item already exists in cart
    const checkResult = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("productId", sql.Int, productId)
      .query(
        "SELECT Id, Quantity FROM Cart WHERE UserId = @userId AND ProductId = @productId",
      );

    if (checkResult.recordset.length > 0) {
      // Update quantity
      const newQuantity = (quantity || 1) + checkResult.recordset[0].Quantity;
      await pool
        .request()
        .input("id", sql.Int, checkResult.recordset[0].Id)
        .input("quantity", sql.Int, newQuantity)
        .query("UPDATE Cart SET Quantity = @quantity WHERE Id = @id");
    } else {
      // Insert new item
      await pool
        .request()
        .input("userId", sql.Int, userId)
        .input("productId", sql.Int, productId)
        .input("quantity", sql.Int, quantity || 1)
        .query(
          "INSERT INTO Cart (UserId, ProductId, Quantity) VALUES (@userId, @productId, @quantity)",
        );
    }

    return NextResponse.json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// DELETE /api/cart
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, clearAll } = body;

    const pool = await getDb();
    const requestObj = pool.request().input("userId", sql.Int, userId);

    if (clearAll) {
      await requestObj.query("DELETE FROM Cart WHERE UserId = @userId");
    } else {
      await requestObj
        .input("productId", sql.Int, productId)
        .query(
          "DELETE FROM Cart WHERE UserId = @userId AND ProductId = @productId",
        );
    }

    return NextResponse.json({ message: "Item(s) removed from cart" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
