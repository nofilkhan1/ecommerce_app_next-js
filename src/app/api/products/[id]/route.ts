import { NextRequest, NextResponse } from 'next/server';
import { initDb, queryOne, execute } from '@/lib/db';
import { verifyApiKey } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const key = _request.headers.get('X-API-Key');
    if (!verifyApiKey(key, 'user')) {
      return NextResponse.json({ success: false, message: 'Invalid or missing API key' }, { status: 401 });
    }

    await initDb();
    const { id } = await params;
    const product = queryOne('SELECT * FROM products WHERE id = ?', [Number(id)]);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('GET /api/products/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const key = _request.headers.get('X-API-Key');
    if (!verifyApiKey(key, 'admin')) {
      return NextResponse.json({ success: false, message: 'Invalid or missing API key' }, { status: 401 });
    }

    await initDb();
    const { id } = await params;
    const product = queryOne('SELECT * FROM products WHERE id = ?', [Number(id)]);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    let body: Record<string, unknown>;
    try {
      body = await _request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid or empty request body' }, { status: 400 });
    }

    const fields: string[] = [];
    const values: unknown[] = [];

    for (const key of ['name', 'description', 'price', 'category', 'image_url', 'stock'] as const) {
      if (body[key] !== undefined) {
        if (key === 'price') {
          const parsed = Number(body[key]);
          if (isNaN(parsed) || parsed <= 0) {
            return NextResponse.json({ success: false, message: 'Price must be a number greater than 0' }, { status: 400 });
          }
          fields.push(`${key} = ?`);
          values.push(parsed);
        } else if (key === 'stock') {
          const parsed = parseInt(String(body[key]), 10);
          if (isNaN(parsed) || parsed < 0) {
            return NextResponse.json({ success: false, message: 'Stock must be a non-negative integer' }, { status: 400 });
          }
          fields.push(`${key} = ?`);
          values.push(parsed);
        } else {
          fields.push(`${key} = ?`);
          values.push(body[key]);
        }
      }
    }

    if (fields.length > 0) {
      fields.push("updated_at = datetime('now')");
      values.push(Number(id));
      execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    const updated = queryOne('SELECT * FROM products WHERE id = ?', [Number(id)]);
    return NextResponse.json(
      { success: true, message: 'Product updated successfully', data: updated }
    );
  } catch (error) {
    console.error('PUT /api/products/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const key = _request.headers.get('X-API-Key');
    if (!verifyApiKey(key, 'admin')) {
      return NextResponse.json({ success: false, message: 'Invalid or missing API key' }, { status: 401 });
    }

    await initDb();
    const { id } = await params;
    const product = queryOne('SELECT * FROM products WHERE id = ?', [Number(id)]);

    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    execute('DELETE FROM products WHERE id = ?', [Number(id)]);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
