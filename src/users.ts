import db, { type User } from './db.js';

export function getAllUsers(): User[] {
  const users = db.prepare('SELECT id, email, role, createdAt FROM users').all() as User[];
  return users;
}

export function deleteUser(id: number): boolean {
  // Check if user is the last admin or something critical if needed
  // For now, just prevent deleting the first user (usually the main admin)
  if (id === 1) return false;
  
  const stmt = db.prepare('DELETE FROM users WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}
