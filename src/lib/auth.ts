export const ADMIN_API_KEY = 'admin-secret-key-2026';
export const USER_API_KEY = 'user-secret-key-2026';

export function verifyApiKey(key: string | null, level: 'admin' | 'user'): boolean {
  if (!key) return false;
  if (key === ADMIN_API_KEY) return true;
  if (level === 'user' && key === USER_API_KEY) return true;
  return false;
}
