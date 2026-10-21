const BASE = import.meta.env.VITE_API_URL ?? '/api';
const TOKEN_KEY = 'bss.token';

export const tokenStore = {
  get() {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* private mode: the session simply won't persist */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message ?? `Request failed (${status})`);
    this.status = status;
    this.errors = body?.errors ?? null;
    this.body = body;
  }
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  const token = tokenStore.get();
  const response = await fetch(`${BASE}${path}`, {
    method,
    signal,
    headers: {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (response.status === 401) tokenStore.clear();
  if (!response.ok) throw new ApiError(response.status, data);

  return data;
}
