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

function saveDb() {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function rowsToObjects(
  columns: string[],
  values: unknown[][]
): Record<string, unknown>[] {
  return values.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
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
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL,
      category TEXT DEFAULT '',
      gender TEXT DEFAULT '',
      subcategory TEXT DEFAULT '',
      image_url TEXT DEFAULT '',
      stock INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const cols = queryAll("PRAGMA table_info(products)").map((c: Record<string, unknown>) => c.name);
  if (!cols.includes('gender')) {
    db.run("ALTER TABLE products ADD COLUMN gender TEXT DEFAULT ''");
  }
  if (!cols.includes('subcategory')) {
    db.run("ALTER TABLE products ADD COLUMN subcategory TEXT DEFAULT ''");
  }
  saveDb();
}

export const CATEGORIES = [
  'SUMMER COLLECTION',
  'CO-ORDS',
  'READY TO WEAR',
  'UNSTITCHED',
  'FORMALS',
  'ACCESSORIES',
] as const;
