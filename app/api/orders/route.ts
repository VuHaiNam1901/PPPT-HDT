import { NextResponse } from "next/server";
import { getDb, sql } from "@/lib/db";

// GET /api/orders?userId=1
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const pool = await getDb();
    const result = await pool.request().input("userId", sql.Int, userId).query(`
        SELECT o.*, 
               (SELECT oi.*, p.Name, p.Image 
                FROM OrderItems oi 
                JOIN Products p ON oi.ProductId = p.Id 
                WHERE oi.OrderId = o.Id 
                FOR JSON PATH) as Items
        FROM Orders o
        WHERE o.UserId = @userId
        ORDER BY o.CreatedAt DESC
      `);

    return NextResponse.json(
      result.recordset.map((order) => ({
        ...order,
        Items: JSON.parse(order.Items || "[]"),
      })),
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// POST /api/orders
export async function POST(request: Request) {
  const pool = await getDb();
  const transaction = new sql.Transaction(pool);

  try {
    const body = await request.json();
    const { userId, totalAmount, shippingAddress, paymentMethod } = body;

    if (!userId || !totalAmount || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await transaction.begin();

    // 1. Create Order
    const orderResult = await transaction
      .request()
      .input("userId", sql.Int, userId)
      .input("totalAmount", sql.Decimal(18, 2), totalAmount)
      .input("shippingAddress", sql.NVarChar, shippingAddress)
      .input("paymentMethod", sql.NVarChar, paymentMethod).query(`
        INSERT INTO Orders (UserId, TotalAmount, ShippingAddress, PaymentMethod)
        OUTPUT INSERTED.Id
        VALUES (@userId, @totalAmount, @shippingAddress, @paymentMethod)
      `);

    const orderId = orderResult.recordset[0].Id;

    // 2. Move items from Cart to OrderItems
    // First, get cart items
    const cartItems = await transaction
      .request()
      .input("userId", sql.Int, userId)
      .query(
        "SELECT ProductId, Quantity, (SELECT Price FROM Products WHERE Id = ProductId) as Price FROM Cart WHERE UserId = @userId",
      );

    for (const item of cartItems.recordset) {
      await transaction
        .request()
        .input("orderId", sql.Int, orderId)
        .input("productId", sql.Int, item.ProductId)
        .input("quantity", sql.Int, item.Quantity)
        .input("price", sql.Decimal(18, 2), item.Price)
        .query(
          "INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price) VALUES (@orderId, @productId, @quantity, @price)",
        );
    }

    // 3. Clear Cart
    await transaction
      .request()
      .input("userId", sql.Int, userId)
      .query("DELETE FROM Cart WHERE UserId = @userId");

    await transaction.commit();

    return NextResponse.json({ message: "Order placed successfully", orderId });
  } catch (error) {
    await transaction.rollback();
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
