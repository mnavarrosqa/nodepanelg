import db from './db.js';

const DEFAULTS: Record<string, string> = {
  panelName: 'NodePanelG',
  panelUrl: 'http://localhost:3000',
  timezone: 'UTC',
};

function get(key: string): string {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row ? row.value : (DEFAULTS[key] ?? '');
}

function set(key: string, value: string): void {
  db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = ?').run(
    key,
    value,
    value
  );
}

export function getAllSettings(): Record<string, string> {
  const keys = Object.keys(DEFAULTS);
  const out: Record<string, string> = {};
  for (const k of keys) {
    out[k] = get(k);
  }
  return out;
}

export function updateSettings(updates: Partial<Record<string, string>>): Record<string, string> {
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined && DEFAULTS.hasOwnProperty(key)) {
      set(key, String(value));
    }
  }
  return getAllSettings();
}
