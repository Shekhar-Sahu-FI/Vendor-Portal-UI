import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = path.join(__dirname, 'auth.json');
const isCI = !!process.env.CI;

const workers = process.env.PW_WORKERS
  ? Number(process.env.PW_WORKERS)
  : isCI
    ? 1
    : 1;

export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/global-setup.ts',
  globalTeardown: './tests/global-teardown.ts',
  fullyParallel: workers > 1,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  timeout: 120_000,
  expect: { timeout: 15_000 },

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
    ignoreHTTPSErrors: true,
    trace: isCI ? 'on-first-retry' : 'off',
    screenshot: 'only-on-failure',
    video: isCI ? 'retain-on-failure' : 'off',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    launchOptions: {
      args: [
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-sync',
        '--no-first-run',
      ],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
      testIgnore: /auth\.setup\.ts/,
    },
  ],
});
