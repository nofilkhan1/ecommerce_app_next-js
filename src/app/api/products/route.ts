import { NextRequest, NextResponse } from 'next/server';
import { initDb, queryAll, execute, getProductsWithImages, CATEGORIES, GENDERS, SUBCATEGORIES } from '@/lib/db';
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
    const subcategory = searchParams.get('subcategory');
    const featured = searchParams.get('featured') === 'true';
    const status = searchParams.get('status') || 'published';
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined;
    const offset = searchParams.get('offset') ? Number(searchParams.get('offset')) : undefined;

    const products = getProductsWithImages({
      gender: gender || undefined,
      category: category || undefined,
      subcategory: subcategory || undefined,
      featured,
      status,
      search: search || undefined,
      limit,
      offset,
    });

    return NextResponse.json({ success: true, data: products });
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

    const {
      name, description, short_description, price, sale_price, stock,
      category, gender, subcategory, collection, brand,
      sku, status, visibility, featured, tags, sizes, colors,
      materials, weight, seo_title, seo_description, seo_keywords,
      meta_title, meta_description, image_url
    } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ success: false, message: 'Product name is required' }, { status: 400 });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ success: false, message: 'Price must be a number greater than 0' }, { status: 400 });
    }

    const parsedSalePrice = sale_price !== undefined && sale_price !== null && sale_price !== '' ? Number(sale_price) : null;
    if (parsedSalePrice !== null && (isNaN(parsedSalePrice) || parsedSalePrice < 0)) {
      return NextResponse.json({ success: false, message: 'Sale price must be a non-negative number' }, { status: 400 });
    }
    if (parsedSalePrice !== null && parsedSalePrice >= parsedPrice) {
      return NextResponse.json({ success: false, message: 'Sale price must be less than regular price' }, { status: 400 });
    }

    const parsedStock = stock !== undefined ? parseInt(String(stock), 10) : 0;
    if (isNaN(parsedStock) || parsedStock < 0) {
      return NextResponse.json({ success: false, message: 'Stock must be a non-negative integer' }, { status: 400 });
    }

    const parsedWeight = weight !== undefined ? Number(weight) : 0;
    if (isNaN(parsedWeight) || parsedWeight < 0) {
      return NextResponse.json({ success: false, message: 'Weight must be a non-negative number' }, { status: 400 });
    }

    const parsedFeatured = featured === true || featured === 1 || featured === 'true' ? 1 : 0;

    const slug = (name as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const result = execute(
      `INSERT INTO products (
        name, slug, sku, description, short_description, price, sale_price, stock,
        category, gender, subcategory, collection, brand, status, visibility,
        featured, tags, sizes, colors, materials, weight,
        seo_title, seo_description, seo_keywords, meta_title, meta_description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        slug,
        (sku as string)?.trim() || '',
        (description as string)?.trim() || '',
        (short_description as string)?.trim() || '',
        parsedPrice,
        parsedSalePrice,
        parsedStock,
        (category as string)?.trim() || '',
        (gender as string)?.trim() || '',
        (subcategory as string)?.trim() || '',
        (collection as string)?.trim() || '',
        (brand as string)?.trim() || '',
        (status as string)?.trim() || 'draft',
        (visibility as string)?.trim() || 'visible',
        parsedFeatured,
        (tags as string)?.trim() || '',
        (sizes as string)?.trim() || '',
        (colors as string)?.trim() || '',
        (materials as string)?.trim() || '',
        parsedWeight,
        (seo_title as string)?.trim() || `${name} | J. (Junaid Jamshed)`,
        (seo_description as string)?.trim() || (short_description as string)?.trim() || (description as string)?.trim()?.substring(0, 160) || '',
        (seo_keywords as string)?.trim() || (tags as string)?.trim() || '',
        (meta_title as string)?.trim() || `${name} | J. (Junaid Jamshed)`,
        (meta_description as string)?.trim() || (short_description as string)?.trim() || (description as string)?.trim()?.substring(0, 160) || '',
      ]
    );

    const productId = result.lastInsertRowid;

    // Handle primary image if provided
    if (image_url && typeof image_url === 'string' && image_url.trim()) {
      execute(
        'INSERT INTO product_images (product_id, url, alt, type, sort_order) VALUES (?, ?, ?, ?, ?)',
        [productId, image_url.trim(), name, 'primary', 0]
      );
    }

    const product = queryAll('SELECT * FROM products WHERE id = ?', [productId])[0];
    const images = queryAll('SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order', [productId]);

    return NextResponse.json(
      { success: true, message: 'Product created successfully', data: { ...product, images } },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/products error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}