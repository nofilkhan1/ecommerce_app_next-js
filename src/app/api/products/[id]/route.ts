import { NextRequest, NextResponse } from 'next/server';
import { initDb, queryOne, execute } from '@/lib/db';
import { verifyApiKey } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const key = _request.headers.get('X-API-Key');
  if (!verifyApiKey(key, 'user')) {
    return NextResponse.json({ detail: 'Invalid or missing API key' }, { status: 401 });
  }

  await initDb();
  const { id } = await params;
  const product = queryOne('SELECT * FROM products WHERE id = ?', [Number(id)]);

  if (!product) {
    return NextResponse.json({ detail: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const key = _request.headers.get('X-API-Key');
  if (!verifyApiKey(key, 'admin')) {
    return NextResponse.json({ detail: 'Invalid or missing API key' }, { status: 401 });
  }

  await initDb();
  const { id } = await params;
  const product = queryOne('SELECT * FROM products WHERE id = ?', [Number(id)]);

  if (!product) {
    return NextResponse.json({ detail: 'Product not found' }, { status: 404 });
  }

  const body = await _request.json();
  const fields: string[] = [];
  const values: unknown[] = [];

  for (const key of ['name', 'description', 'price', 'category', 'image_url', 'stock'] as const) {
    if (body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (fields.length > 0) {
    fields.push("updated_at = datetime('now')");
    values.push(Number(id));
    execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  const updated = queryOne('SELECT * FROM products WHERE id = ?', [Number(id)]);
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const key = _request.headers.get('X-API-Key');
  if (!verifyApiKey(key, 'admin')) {
    return NextResponse.json({ detail: 'Invalid or missing API key' }, { status: 401 });
  }

  await initDb();
  const { id } = await params;
  const product = queryOne('SELECT * FROM products WHERE id = ?', [Number(id)]);

  if (!product) {
    return NextResponse.json({ detail: 'Product not found' }, { status: 404 });
  }

  execute('DELETE FROM products WHERE id = ?', [Number(id)]);
  return new NextResponse(null, { status: 204 });
}
