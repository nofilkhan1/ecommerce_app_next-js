import { NextRequest, NextResponse } from 'next/server';
import { initDb, queryOne, execute, queryAll } from '@/lib/db';
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

    const images = queryAll('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order', [Number(id)]);

    return NextResponse.json({ ...product, images });
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

    const allowedFields = [
      'name', 'slug', 'sku', 'description', 'short_description', 'price', 'sale_price', 'stock',
      'category', 'gender', 'subcategory', 'collection', 'brand',
      'status', 'visibility', 'featured', 'tags',
      'sizes', 'colors', 'materials', 'weight',
      'seo_title', 'seo_description', 'seo_keywords', 'meta_title', 'meta_description'
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === 'price' || field === 'sale_price' || field === 'weight') {
          const parsed = body[field] === null || body[field] === '' ? null : Number(body[field]);
          if (parsed !== null && (isNaN(parsed) || parsed < 0)) {
            return NextResponse.json({ success: false, message: `${field} must be a non-negative number` }, { status: 400 });
          }
          if (field === 'price' && (parsed === null || parsed <= 0)) {
            return NextResponse.json({ success: false, message: 'Price must be a number greater than 0' }, { status: 400 });
          }
          fields.push(`${field} = ?`);
          values.push(parsed);
        } else if (field === 'stock' || field === 'featured') {
          const parsed = body[field] === null || body[field] === '' ? 0 : parseInt(String(body[field]), 10);
          if (isNaN(parsed) || parsed < 0) {
            return NextResponse.json({ success: false, message: `${field} must be a non-negative integer` }, { status: 400 });
          }
          fields.push(`${field} = ?`);
          values.push(parsed);
        } else {
          fields.push(`${field} = ?`);
          values.push(body[field]);
        }
      }
    }

    if (fields.length > 0) {
      fields.push("updated_at = datetime('now')");
      values.push(Number(id));
      execute(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    // Handle images
    if (body.images && Array.isArray(body.images)) {
      execute('DELETE FROM product_images WHERE product_id = ?', [Number(id)]);
      for (let i = 0; i < body.images.length; i++) {
        const img = body.images[i];
        if (img && img.url) {
          execute(
            'INSERT INTO product_images (product_id, url, alt, type, sort_order) VALUES (?, ?, ?, ?, ?)',
            [Number(id), img.url, img.alt || '', i === 0 ? 'primary' : 'gallery', i]
          );
        }
      }
    }

    const updated = queryOne('SELECT * FROM products WHERE id = ?', [Number(id)]);
    const images = queryAll('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order', [Number(id)]);

    return NextResponse.json(
      { success: true, message: 'Product updated successfully', data: { ...updated, images } }
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

    execute('DELETE FROM product_images WHERE product_id = ?', [Number(id)]);
    execute('DELETE FROM products WHERE id = ?', [Number(id)]);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/products/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}