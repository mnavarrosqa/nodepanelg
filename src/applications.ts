import db from './db.js';

export interface Application {
  id: number;
  name: string;
  status: 'running' | 'stopped' | 'error';
  port: number | null;
  scriptPath: string | null;
  createdAt: string;
  updatedAt: string;
}

function rowToApp(row: any): Application {
  return {
    id: row.id,
    name: row.name,
    status: (row.status === 'running' || row.status === 'error' ? row.status : 'stopped') as Application['status'],
    port: row.port != null ? row.port : null,
    scriptPath: row.scriptPath ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function getAllApplications(): Application[] {
  const rows = db.prepare('SELECT * FROM applications ORDER BY name').all() as any[];
  return rows.map(rowToApp);
}

export function getApplication(id: number): Application | null {
  const row = db.prepare('SELECT * FROM applications WHERE id = ?').get(id) as any;
  return row ? rowToApp(row) : null;
}

export function createApplication(data: { name: string; port?: number; scriptPath?: string }): Application {
  const stmt = db.prepare(
    'INSERT INTO applications (name, status, port, scriptPath) VALUES (?, ?, ?, ?)'
  );
  const info = stmt.run(data.name, 'stopped', data.port ?? null, data.scriptPath ?? null);
  const app = getApplication(info.lastInsertRowid as number)!;
  return app;
}

export function updateApplication(
  id: number,
  data: { name?: string; status?: Application['status']; port?: number | null; scriptPath?: string | null }
): Application | null {
  const current = getApplication(id);
  if (!current) return null;

  const name = data.name ?? current.name;
  const status = data.status ?? current.status;
  const port = data.port !== undefined ? data.port : current.port;
  const scriptPath = data.scriptPath !== undefined ? data.scriptPath : current.scriptPath;

  db.prepare(
    'UPDATE applications SET name = ?, status = ?, port = ?, scriptPath = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(name, status, port, scriptPath, id);

  return getApplication(id);
}

export function deleteApplication(id: number): boolean {
  const stmt = db.prepare('DELETE FROM applications WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}
