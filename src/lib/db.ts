import initSqlJs from 'sql.js';
import type { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const DB_PATH = path.join(PROJECT_ROOT, 'ecommerce.db');
const SQL_WASM_DIR = path.join(PROJECT_ROOT, 'node_modules', 'sql.js', 'dist');

let db: SqlJsDatabase;

export function saveDb() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

export function queryAll(sql: string, params?: unknown[]): Record<string, unknown>[] {
  if (!db) throw new Error('DB not initialized');
  const stmt = db.prepare(sql);
  if (params) stmt.bind(params);
  const results: Record<string, unknown>[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

export function queryOne(sql: string, params?: unknown[]): Record<string, unknown> | null {
  if (!db) throw new Error('DB not initialized');
  const stmt = db.prepare(sql);
  if (params) stmt.bind(params);
  let result: Record<string, unknown> | null = null;
  if (stmt.step()) {
    result = stmt.getAsObject();
  }
  stmt.free();
  return result;
}

export function execute(sql: string, params?: unknown[]): { changes: number; lastInsertRowid: number } {
  if (!db) throw new Error('DB not initialized');
  const stmt = db.prepare(sql);
  if (params) stmt.bind(params);
  stmt.step();
  stmt.free();

  const row = queryOne('SELECT last_insert_rowid() as id');
  const lastInsertRowid = row?.id ?? 0;

  saveDb();
  return { changes: db.getRowsModified(), lastInsertRowid: Number(lastInsertRowid) };
}

function tableHasColumn(tableName: string, columnName: string): boolean {
  const cols = queryAll(`PRAGMA table_info(${tableName})`).map((c: Record<string, unknown>) => c.name);
  return cols.includes(columnName);
}

export async function initDb(): Promise<void> {
  if (db) return;
  const SQL = await initSqlJs({
    locateFile: (file: string) => path.join(SQL_WASM_DIR, file),
  });
  if (fs.existsSync(DB_PATH)) {
    db = new SQL.Database(fs.readFileSync(DB_PATH));
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      gender TEXT DEFAULT '',
      parent_id INTEGER DEFAULT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      start_date TEXT DEFAULT NULL,
      end_date TEXT DEFAULT NULL,
      is_active INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT DEFAULT '',
      sku TEXT DEFAULT '',
      description TEXT DEFAULT '',
      short_description TEXT DEFAULT '',
      price REAL NOT NULL,
      sale_price REAL DEFAULT NULL,
      stock INTEGER DEFAULT 0,
      category TEXT DEFAULT '',
      gender TEXT DEFAULT '',
      subcategory TEXT DEFAULT '',
      collection TEXT DEFAULT '',
      brand TEXT DEFAULT '',
      status TEXT DEFAULT 'draft',
      visibility TEXT DEFAULT 'visible',
      featured INTEGER DEFAULT 0,
      tags TEXT DEFAULT '',
      sizes TEXT DEFAULT '',
      colors TEXT DEFAULT '',
      materials TEXT DEFAULT '',
      weight REAL DEFAULT 0,
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      seo_keywords TEXT DEFAULT '',
      meta_title TEXT DEFAULT '',
      meta_description TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      alt TEXT DEFAULT '',
      type TEXT DEFAULT 'gallery',
      sort_order INTEGER DEFAULT 0,
      width INTEGER DEFAULT 0,
      height INTEGER DEFAULT 0,
      file_size INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id)
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_product_images_type ON product_images(type)
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured)
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender)
  `);
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_products_subcategory ON products(subcategory)
  `);

  if (!tableHasColumn('products', 'slug')) {
    db.run("ALTER TABLE products ADD COLUMN slug TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'sku')) {
    db.run("ALTER TABLE products ADD COLUMN sku TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'short_description')) {
    db.run("ALTER TABLE products ADD COLUMN short_description TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'sale_price')) {
    db.run("ALTER TABLE products ADD COLUMN sale_price REAL DEFAULT NULL");
  }
  if (!tableHasColumn('products', 'collection')) {
    db.run("ALTER TABLE products ADD COLUMN collection TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'brand')) {
    db.run("ALTER TABLE products ADD COLUMN brand TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'status')) {
    db.run("ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'draft'");
  }
  if (!tableHasColumn('products', 'visibility')) {
    db.run("ALTER TABLE products ADD COLUMN visibility TEXT DEFAULT 'visible'");
  }
  if (!tableHasColumn('products', 'featured')) {
    db.run("ALTER TABLE products ADD COLUMN featured INTEGER DEFAULT 0");
  }
  if (!tableHasColumn('products', 'tags')) {
    db.run("ALTER TABLE products ADD COLUMN tags TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'sizes')) {
    db.run("ALTER TABLE products ADD COLUMN sizes TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'colors')) {
    db.run("ALTER TABLE products ADD COLUMN colors TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'materials')) {
    db.run("ALTER TABLE products ADD COLUMN materials TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'weight')) {
    db.run("ALTER TABLE products ADD COLUMN weight REAL DEFAULT 0");
  }
  if (!tableHasColumn('products', 'seo_title')) {
    db.run("ALTER TABLE products ADD COLUMN seo_title TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'seo_description')) {
    db.run("ALTER TABLE products ADD COLUMN seo_description TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'seo_keywords')) {
    db.run("ALTER TABLE products ADD COLUMN seo_keywords TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'meta_title')) {
    db.run("ALTER TABLE products ADD COLUMN meta_title TEXT DEFAULT ''");
  }
  if (!tableHasColumn('products', 'meta_description')) {
    db.run("ALTER TABLE products ADD COLUMN meta_description TEXT DEFAULT ''");
  }

  saveDb();
}

export function getProductWithImages(productId: number): Record<string, unknown> | null {
  const product = queryOne('SELECT * FROM products WHERE id = ?', [productId]);
  if (!product) return null;

  const images = queryAll(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [productId]
  );

  const primaryImage = images.find((img) => img.type === 'primary') || images[0] || null;
  const galleryImages = images.filter((img) => img.type !== 'primary');

  return {
    ...product,
    images,
    primary_image: primaryImage ? (primaryImage as Record<string, unknown>).url : null,
    gallery_images: galleryImages.map((img) => (img as Record<string, unknown>).url),
  };
}

export function getProductsWithImages(
  options?: {
    gender?: string;
    category?: string;
    subcategory?: string;
    featured?: boolean;
    status?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }
): Record<string, unknown>[] {
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params: unknown[] = [];

  if (options?.gender) {
    sql += ' AND gender = ?';
    params.push(options.gender);
  }
  if (options?.subcategory) {
    sql += ' AND subcategory = ?';
    params.push(options.subcategory);
  }
  if (options?.category) {
    sql += ' AND category = ?';
    params.push(options.category);
  }
  if (options?.featured) {
    sql += ' AND featured = 1';
  }
  if (options?.status) {
    sql += ' AND status = ?';
    params.push(options.status);
  } else {
    sql += " AND status = 'published'";
  }
  if (options?.search) {
    sql += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
    const term = `%${options.search}%`;
    params.push(term, term, term);
  }

  sql += ' ORDER BY created_at DESC';

  if (options?.limit) {
    sql += ' LIMIT ?';
    params.push(options.limit);
  }
  if (options?.offset) {
    sql += ' OFFSET ?';
    params.push(options.offset);
  }

  const products = queryAll(sql, params);

  return products.map((product) => {
    const pid = (product as Record<string, unknown>).id as number;
    const images = queryAll(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
      [pid]
    );
    const primaryImage = images.find((img) => img.type === 'primary') || images[0] || null;

    return {
      ...product,
      images,
      primary_image: primaryImage ? (primaryImage as Record<string, unknown>).url : null,
    };
  });
}

export const CATEGORIES = [
  'SUMMER COLLECTION',
  'CO-ORDS',
  'READY TO WEAR',
  'UNSTITCHED',
  'FORMALS',
  'ACCESSORIES',
] as const;

export const GENDERS = ['WOMEN', 'MEN', 'TEENS'] as const;

export const SUBCATEGORIES = [
  { value: 'summer-collection', label: 'Summer Collection' },
  { value: 'co-ords', label: 'Co-ords' },
  { value: 'ready-to-wear', label: 'Ready to Wear' },
  { value: 'unstitched', label: 'Unstitched' },
  { value: 'formals', label: 'Formals' },
  { value: 'accessories', label: 'Accessories' },
] as const;
