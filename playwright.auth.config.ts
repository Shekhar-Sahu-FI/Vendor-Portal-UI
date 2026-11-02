import { defineConfig } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/** Config for `npm run auth:setup` only — forces a fresh login. */
export default defineConfig({
  testDir: './tests',
  reporter: [['list']],
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5173',
    ignoreHTTPSErrors: true,
  },
  projects: [{ name: 'setup', testMatch: /auth\.setup\.ts/ }],
});
