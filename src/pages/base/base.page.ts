import { Page } from '@playwright/test';
import { DialogHelper } from '../../utils/dialog.helper';
import { env } from '../../utils/env';

export abstract class BasePage {
  readonly dialog: DialogHelper;

  constructor(
    protected readonly page: Page,
    protected readonly path: string,
  ) {
    this.dialog = new DialogHelper(page);
  }

  async goto() {
    await this.page.goto(`${env.baseUrl}${this.path}`, { waitUntil: 'domcontentloaded' });
  }

  async waitForAppReady() {
    const preloader = this.page.locator('.uc-preloader, [class*="preloader"], .z-spinner, div:has(> .loader-orbit-cw)').first();
    const timeout = Number(process.env.PW_PRELOADER_TIMEOUT_MS ?? 15_000);
    await preloader.waitFor({ state: 'hidden', timeout }).catch(() => {});
  }
}
