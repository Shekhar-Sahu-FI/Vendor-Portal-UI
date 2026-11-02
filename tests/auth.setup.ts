import { test as setup } from '@playwright/test';
import { refreshAuthStateViaApi } from '../src/utils/auth-setup';

/**
 * Manual auth refresh: `npm run auth:setup`
 * Normal runs use fresh API login in global-setup; auth.json is removed in global-teardown.
 */
setup('authenticate', async () => {
  await refreshAuthStateViaApi();
});
