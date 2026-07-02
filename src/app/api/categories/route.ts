import { NextResponse } from 'next/server';
import { initDb, queryAll } from '@/lib/db';

export async function GET() {
  try {
    await initDb();
    const categories = queryAll('SELECT * FROM categories ORDER BY sort_order, name');
    return NextResponse.json(categories);
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}