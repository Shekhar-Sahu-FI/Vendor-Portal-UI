import type { FullConfig } from '@playwright/test';
import { cleanupAuthAfterTestRun } from '../src/utils/auth-setup';

async function globalTeardown(_config: FullConfig) {
  await cleanupAuthAfterTestRun();
}

export default globalTeardown;
