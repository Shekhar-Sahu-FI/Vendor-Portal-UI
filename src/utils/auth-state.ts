import fs from 'fs';
import path from 'path';

export const AUTH_FILE = path.resolve(__dirname, '../../auth.json');

/** Re-login if auth.json is older than this (ms). Only when PW_REUSE_AUTH=1. */
const AUTH_FILE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

/** When true, global-setup may skip login if auth.json is still valid. */
export function shouldReuseAuthState(): boolean {
  return process.env.PW_REUSE_AUTH === '1' || process.env.REUSE_AUTH === '1';
}

export function deleteAuthState(authPath: string = AUTH_FILE): void {
  if (fs.existsSync(authPath)) {
    fs.unlinkSync(authPath);
  }
}

/** Refresh before cookie expiry to avoid mid-run 401s. */
const COOKIE_EXPIRY_BUFFER_MS = 5 * 60 * 1000;

/**
 * Returns true when `auth.json` exists and session cookies are still valid.
 */
export function isAuthStateValid(authPath: string = AUTH_FILE): boolean {
  if (!fs.existsSync(authPath)) {
    return false;
  }

  try {
    const stat = fs.statSync(authPath);
    if (Date.now() - stat.mtimeMs > AUTH_FILE_MAX_AGE_MS) {
      return false;
    }

    const state = JSON.parse(fs.readFileSync(authPath, 'utf-8')) as {
      cookies?: Array<{ name: string; expires?: number }>;
    };
    const cookies = state.cookies ?? [];
    if (cookies.length === 0) {
      return false;
    }

    const authCookie = cookies.find((c) => c.name === 'authToken');
    if (!authCookie?.expires || authCookie.expires <= 0) {
      return true;
    }

    return Date.now() < authCookie.expires * 1000 - COOKIE_EXPIRY_BUFFER_MS;
  } catch {
    return false;
  }
}
