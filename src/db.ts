import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const dataDir = path.join(projectRoot, 'data');
let db: Database.Database;
try {
  fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, 'nodepanelg.db');
  db = new Database(dbPath);
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err);
  throw new Error(`Database init failed: ${message}`);
}

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'stopped',
    port INTEGER,
    scriptPath TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

export default db;

export interface User {
  id: number;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  createdAt: string;
}
