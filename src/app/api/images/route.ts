import { NextRequest, NextResponse } from 'next/server';
import { initDb, execute } from '@/lib/db';
import { verifyApiKey } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..');
const UPLOAD_DIR = path.join(PROJECT_ROOT, 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    const key = request.headers.get('X-API-Key');
    if (!verifyApiKey(key, 'admin')) {
      return NextResponse.json({ success: false, message: 'Invalid or missing API key' }, { status: 401 });
    }

    await initDb();

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('product_id') as string;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, message: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const timestamp = Date.now();
    const extension = path.extname(file.name).toLowerCase();
    const filename = `product-${productId || 'temp'}-${timestamp}${extension}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;

    let imageRecord = null;
    if (productId) {
      const productIdNum = parseInt(productId, 10);
      const existingImages = await import('@/lib/db').then(m => m.queryAll('SELECT COUNT(*) as count FROM product_images WHERE product_id = ?', [productIdNum]));
      const sortOrder = (existingImages[0]?.count as number) ?? 0;
      const type = sortOrder === 0 ? 'primary' : 'gallery';

      execute(
        'INSERT INTO product_images (product_id, url, alt, type, sort_order, width, height, file_size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [productIdNum, publicUrl, file.name, type, sortOrder, 0, 0, file.size]
      );

      imageRecord = { product_id: productIdNum, url: publicUrl, type, sort_order: sortOrder };
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type,
        ...imageRecord,
      }
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/images error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const key = request.headers.get('X-API-Key');
    if (!verifyApiKey(key, 'admin')) {
      return NextResponse.json({ success: false, message: 'Invalid or missing API key' }, { status: 401 });
    }

    await initDb();

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');
    const productId = searchParams.get('product_id');

    if (!imageId) {
      return NextResponse.json({ success: false, message: 'Image ID is required' }, { status: 400 });
    }

    const image = await import('@/lib/db').then(m => m.queryOne('SELECT * FROM product_images WHERE id = ?', [parseInt(imageId, 10)]));

    if (!image) {
      return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
    }

    // Delete file from filesystem
    const filepath = path.join(PROJECT_ROOT, 'public', (image as Record<string, unknown>).url as string);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    // Delete from database
    execute('DELETE FROM product_images WHERE id = ?', [parseInt(imageId, 10)]);

    // If this was a primary image, promote the next gallery image
    if ((image as Record<string, unknown>).type === 'primary' && productId) {
      const nextImage = await import('@/lib/db').then(m => m.queryOne(
        'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order LIMIT 1',
        [parseInt(productId, 10)]
      ));
      if (nextImage) {
        execute('UPDATE product_images SET type = ? WHERE id = ?', ['primary', (nextImage as Record<string, unknown>).id]);
      }
    }

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/images error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
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

    const { id, sort_order, type, alt } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Image ID is required' }, { status: 400 });
    }

    const image = await import('@/lib/db').then(m => m.queryOne('SELECT * FROM product_images WHERE id = ?', [parseInt(id as string, 10)]));

    if (!image) {
      return NextResponse.json({ success: false, message: 'Image not found' }, { status: 404 });
    }

    const fields: string[] = [];
    const values: unknown[] = [];

    if (sort_order !== undefined) {
      fields.push('sort_order = ?');
      values.push(Number(sort_order));
    }
    if (type !== undefined) {
      fields.push('type = ?');
      values.push(type);
    }
    if (alt !== undefined) {
      fields.push('alt = ?');
      values.push(alt);
    }

    if (fields.length > 0) {
      values.push(Number(id));
      execute(`UPDATE product_images SET ${fields.join(', ')} WHERE id = ?`, values);
    }

    // If setting as primary, demote other primary images for this product
    if (type === 'primary') {
      const productId = (image as Record<string, unknown>).product_id;
      execute(
        'UPDATE product_images SET type = ? WHERE product_id = ? AND id != ? AND type = ?',
        ['gallery', productId, Number(id), 'primary']
      );
    }

    const updated = await import('@/lib/db').then(m => m.queryOne('SELECT * FROM product_images WHERE id = ?', [Number(id)]));

    return NextResponse.json({ success: true, message: 'Image updated successfully', data: updated });
  } catch (error) {
    console.error('PUT /api/images error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}