import { NextRequest, NextResponse } from 'next/server';
import { initDb, queryAll, execute, CATEGORIES } from '@/lib/db';
import { verifyApiKey } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const key = request.headers.get('X-API-Key');
  if (!verifyApiKey(key, 'user')) {
    return NextResponse.json({ detail: 'Invalid or missing API key' }, { status: 401 });
  }

  await initDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  const rows = category
    ? queryAll('SELECT * FROM products WHERE category = ? ORDER BY created_at DESC', [category])
    : queryAll('SELECT * FROM products ORDER BY created_at DESC');

  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const key = request.headers.get('X-API-Key');
  if (!verifyApiKey(key, 'admin')) {
    return NextResponse.json({ detail: 'Invalid or missing API key' }, { status: 401 });
  }

  await initDb();
  const body = await request.json();
  const { name, description, price, category, image_url, stock } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ detail: 'Name is required' }, { status: 400 });
  }
  if (!price || price <= 0) {
    return NextResponse.json({ detail: 'Price must be greater than 0' }, { status: 400 });
  }

  execute(
    `INSERT INTO products (name, description, price, category, image_url, stock)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name.trim(), description || '', price, category || '', image_url || '', stock || 0]
  );

  const rows = queryAll('SELECT * FROM products ORDER BY id DESC LIMIT 1');
  const product = rows[0];
  return NextResponse.json(product, { status: 201 });
}
