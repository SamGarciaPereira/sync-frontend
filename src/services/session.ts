/**
 * Temporary until login (US22) exists: every request acts on this user.
 * Set VITE_USER_ID in .env to use another user id.
 */
export const CURRENT_USER_ID = Number(import.meta.env.VITE_USER_ID) || 1;
