import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { fillTextField } from '../../utils/field-accessor';
import { env, requireEnv } from '../../utils/env';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page, '/');
  }

  async login(username: string, password: string, options?: { waitForApp?: boolean }) {
    await this.goto();
    await fillTextField(this.page, 'Username / Email / Contact No.', username);
    await fillTextField(this.page, 'Password', password);
    await this.page.locator('form button[type="submit"]').click();
    await this.page.waitForURL(
      /\/(company|vendor)\/(dashboard|transaction|master|security|utility)/,
      { timeout: 30_000 },
    );
    if (options?.waitForApp !== false) {
      await this.waitForAppReady();
    }
  }

  async loginWithEnvCredentials() {
    await this.login(
      requireEnv(env.testUsername, 'TEST_USERNAME or TEST_EMAIL'),
      requireEnv(env.testPassword, 'TEST_PASSWORD'),
    );
  }
}
