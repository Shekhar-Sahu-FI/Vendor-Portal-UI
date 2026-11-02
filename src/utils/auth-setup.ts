import fs from 'fs';
import { chromium, request as playwrightRequest } from '@playwright/test';
import { ApiClient, type LoginTokens } from './api/api-client';
import { LoginPage } from '../pages/auth/login.page';
import { AUTH_FILE, deleteAuthState, shouldReuseAuthState } from './auth-state';
import { env, requireEnv } from './env';

function resolveApiBaseUrl(): string {
  return env.apiBaseUrl.replace('://localhost', '://127.0.0.1');
}

function isConnectionError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|connect/i.test(message);
}

function jwtExpirySeconds(token: string): number {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(
      Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString(),
    ) as { exp?: number };
    if (decoded.exp) {
      return decoded.exp;
    }
  } catch {
    /* fall through */
  }
  return Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
}

export function buildStorageState(tokens: LoginTokens) {
  const origin = env.baseUrl.replace(/\/$/, '');
  const domain = new URL(origin).hostname;
  const expires = Math.max(
    jwtExpirySeconds(tokens.authToken),
    tokens.refreshToken ? jwtExpirySeconds(tokens.refreshToken) : 0,
  );

  const cookies = [
    {
      name: 'authToken',
      value: tokens.authToken,
      domain,
      path: '/',
      expires,
      httpOnly: false,
      secure: origin.startsWith('https'),
      sameSite: 'Lax' as const,
    },
  ];

  if (tokens.refreshToken) {
    cookies.push({
      name: 'refreshToken',
      value: tokens.refreshToken,
      domain,
      path: '/',
      expires,
      httpOnly: false,
      secure: origin.startsWith('https'),
      sameSite: 'Lax' as const,
    });
  }

  return {
    cookies,
    origins: [
      {
        origin,
        localStorage: [
          { name: 'themeVars', value: '{}' },
          { name: 'theme', value: 'light' },
        ],
      },
    ],
  };
}

export function writeAuthState(tokens: LoginTokens, authPath: string = AUTH_FILE): void {
  fs.writeFileSync(authPath, JSON.stringify(buildStorageState(tokens), null, 2));
}

/**
 * Fast auth via API only (no browser). Used at the start of each test run by default.
 */
export async function refreshAuthStateViaApi(authPath: string = AUTH_FILE): Promise<void> {
  const username = requireEnv(env.testUsername, 'TEST_USERNAME or TEST_EMAIL');
  const password = requireEnv(env.testPassword, 'TEST_PASSWORD');

  const requestContext = await playwrightRequest.newContext({
    baseURL: resolveApiBaseUrl(),
    timeout: 15_000,
  });
  try {
    const tokens = await ApiClient.loginWithTokens(requestContext, username, password);
    writeAuthState(tokens, authPath);
  } finally {
    await requestContext.dispose();
  }
}

/**
 * At the start of a run: drop stale auth (unless PW_REUSE_AUTH=1), then log in.
 * Tries API first; if the API host is unreachable, logs in through the UI (BASE_URL).
 */
export async function prepareAuthForTestRun(authPath: string = AUTH_FILE): Promise<void> {
  if (!shouldReuseAuthState()) {
    deleteAuthState(authPath);
  }
  await refreshAuthStateViaApiWithUiFallback(authPath);
}

export type AuthCleanupMode = 'delete' | 'refresh';

export function resolveAuthCleanupMode(): AuthCleanupMode {
  const mode = (process.env.PW_AUTH_CLEANUP ?? 'delete').toLowerCase();
  return mode === 'refresh' ? 'refresh' : 'delete';
}

/**
 * After all tests: delete auth.json (default) or write a fresh login for the next manual run.
 */
export async function cleanupAuthAfterTestRun(authPath: string = AUTH_FILE): Promise<void> {
  if (process.env.PW_SKIP_AUTH === '1' || process.env.SKIP_AUTH_SETUP === '1') {
    return;
  }

  if (resolveAuthCleanupMode() === 'refresh') {
    await refreshAuthStateViaApiWithUiFallback(authPath);
    console.log('[auth] auth.json refreshed after test run');
    return;
  }

  deleteAuthState(authPath);
  console.log('[auth] auth.json removed after test run');
}

/**
 * API login when the server is up; UI login when the API cannot be reached.
 * Set PW_AUTH_MODE=ui to skip the API attempt (use when only the frontend is running).
 */
export async function refreshAuthStateViaApiWithUiFallback(
  authPath: string = AUTH_FILE,
): Promise<void> {
  const username = requireEnv(env.testUsername, 'TEST_USERNAME or TEST_EMAIL');
  const password = requireEnv(env.testPassword, 'TEST_PASSWORD');

  if (process.env.PW_AUTH_MODE === 'ui') {
    console.log(`[auth] UI login via ${env.baseUrl} (PW_AUTH_MODE=ui)…`);
    await refreshAuthStateViaUi(username, password, authPath);
    return;
  }

  try {
    await refreshAuthStateViaApi(authPath);
    return;
  } catch (error) {
    const forceUi = process.env.PW_AUTH_UI_FALLBACK === '1';
    if (!isConnectionError(error) && !forceUi) {
      throw new Error(
        `${error instanceof Error ? error.message : String(error)}\n` +
          `[auth] API login failed at ${env.apiBaseUrl}. ` +
          'Check API_BASE_URL and credentials, or set PW_AUTH_MODE=ui if only the UI is available.',
      );
    }
    console.log(
      `[auth] API not reachable at ${env.apiBaseUrl} — UI login via ${env.baseUrl}…`,
    );
  }

  await refreshAuthStateViaUi(username, password, authPath);
}

async function refreshAuthStateViaUi(
  username: string,
  password: string,
  authPath: string,
): Promise<void> {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    baseURL: env.baseUrl,
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();

  try {
    const loginPage = new LoginPage(page);
    await loginPage.login(username, password, { waitForApp: false });
    await context.storageState({ path: authPath });
  } finally {
    await browser.close();
  }
}
