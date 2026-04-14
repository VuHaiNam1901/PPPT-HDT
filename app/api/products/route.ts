import { NextResponse } from 'next/server';
import { getDb, sql } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const isNew = searchParams.get('new');
    const limit = parseInt(searchParams.get('limit') || '20');

    const pool = await getDb();
    let query = `
      SELECT p.*, c.Name as CategoryName 
      FROM Products p 
      LEFT JOIN Categories c ON p.CategoryId = c.Id 
      WHERE 1=1
    `;

    const requestObj = pool.request();

    if (category) {
      query += ` AND c.Slug = @category`;
      requestObj.input('category', sql.NVarChar, category);
    }

    if (search) {
      query += ` AND (p.Name LIKE @search OR p.Description LIKE @search)`;
      requestObj.input('search', sql.NVarChar, `%${search}%`);
    }

    if (featured === 'true') {
      query += ` AND p.IsFeatured = 1`;
    }

    if (isNew === 'true') {
      query += ` AND p.IsNew = 1`;
    }

    query += ` ORDER BY p.CreatedAt DESC OFFSET 0 ROWS FETCH NEXT @limit ROWS ONLY`;
    requestObj.input('limit', sql.Int, limit);

    const result = await requestObj.query(query);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
