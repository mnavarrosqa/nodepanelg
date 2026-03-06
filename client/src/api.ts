/**
 * Base URL for API requests. Set VITE_API_URL when the frontend is served
 * from a different origin (e.g. Vite dev server on 5176, API on 3000).
 * Leave unset when served from the same server (e.g. production on 3000).
 */
export const apiBase = (import.meta.env.VITE_API_URL as string) || '';

export function apiUrl(path: string): string {
  const base = apiBase.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}
