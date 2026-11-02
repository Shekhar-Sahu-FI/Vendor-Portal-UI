import type { FullConfig } from '@playwright/test';
import { isAuthStateValid, shouldReuseAuthState } from '../src/utils/auth-state';
import { prepareAuthForTestRun } from '../src/utils/auth-setup';

async function globalSetup(_config: FullConfig) {
  if (process.env.PW_SKIP_AUTH === '1' || process.env.SKIP_AUTH_SETUP === '1') {
    return;
  }

  const started = Date.now();

  if (shouldReuseAuthState() && isAuthStateValid()) {
    console.log(`[auth] Reusing auth.json (${Date.now() - started}ms)`);
    return;
  }

  console.log('[auth] Preparing session for this run…');
  await prepareAuthForTestRun();
  console.log(`[auth] auth.json ready (${Date.now() - started}ms)`);
}

export default globalSetup;
