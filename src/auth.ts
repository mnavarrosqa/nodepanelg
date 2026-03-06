import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db, { type User } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

export function generateToken(user: User): string {
  const { password, ...payload } = user;
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): User | null {
  try {
    return jwt.verify(token, JWT_SECRET) as User;
  } catch {
    return null;
  }
}

// Check if any users exist (to trigger onboarding)
export function hasUsers(): boolean {
  const row = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  return row.count > 0;
}

// Create initial admin user
export async function createAdmin(email: string, passwordPlain: string): Promise<User> {
  const password = await hashPassword(passwordPlain);
  const stmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
  const info = stmt.run(email, password, 'admin');
  
  return {
    id: info.lastInsertRowid as number,
    email,
    role: 'admin',
    createdAt: new Date().toISOString()
  };
}

// Register regular user
export async function registerUser(email: string, passwordPlain: string): Promise<User> {
  const password = await hashPassword(passwordPlain);
  const stmt = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
  const info = stmt.run(email, password, 'user');
  
  return {
    id: info.lastInsertRowid as number,
    email,
    role: 'user',
    createdAt: new Date().toISOString()
  };
}
