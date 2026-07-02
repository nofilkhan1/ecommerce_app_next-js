import { NextRequest, NextResponse } from 'next/server';
import { initDb, queryAll, execute, CATEGORIES } from '@/lib/db';
import { verifyApiKey } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const key = request.headers.get('X-API-Key');
    if (!verifyApiKey(key, 'user')) {
      return NextResponse.json({ success: false, message: 'Invalid or missing API key' }, { status: 401 });
    }

    await initDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const gender = searchParams.get('gender');

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: unknown[] = [];

    if (gender) {
      sql += ' AND gender = ?';
      params.push(gender);
    }
    if (category) {
      sql += ' AND subcategory = ?';
      params.push(category);
    }
    sql += ' ORDER BY created_at DESC';

    const rows = queryAll(sql, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const key = request.headers.get('X-API-Key');
    if (!verifyApiKey(key, 'admin')) {
      return NextResponse.json({ success: false, message: 'Invalid or missing API key' }, { status: 401 });
    }

    await initDb();

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid or empty request body' }, { status: 400 });
    }

    const { name, description, price, category, gender, subcategory, image_url, stock } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Product name is required' }, { status: 400 });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ success: false, message: 'Price must be a number greater than 0' }, { status: 400 });
    }

    const parsedStock = stock !== undefined ? parseInt(String(stock), 10) : 0;
    if (isNaN(parsedStock) || parsedStock < 0) {
      return NextResponse.json({ success: false, message: 'Stock must be a non-negative integer' }, { status: 400 });
    }

    const sanitizedCategory = typeof category === 'string' ? category.trim() : '';
    const sanitizedGender = typeof gender === 'string' ? gender.trim() : '';
    const sanitizedSubcategory = typeof subcategory === 'string' ? subcategory.trim() : '';
    const sanitizedDescription = typeof description === 'string' ? description.trim() : '';
    const sanitizedImageUrl = typeof image_url === 'string' ? image_url.trim() : '';

    execute(
      `INSERT INTO products (name, description, price, category, gender, subcategory, image_url, stock)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), sanitizedDescription, parsedPrice, sanitizedCategory, sanitizedGender, sanitizedSubcategory, sanitizedImageUrl, parsedStock]
    );

    const rows = queryAll('SELECT * FROM products ORDER BY id DESC LIMIT 1');
    const product = rows[0];

    return NextResponse.json(
      { success: true, message: 'Product created successfully', data: product },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
