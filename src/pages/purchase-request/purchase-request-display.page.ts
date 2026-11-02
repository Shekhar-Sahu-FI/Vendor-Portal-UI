import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { PURCHASE_REQUEST_ROUTES } from './purchase-request.constants';

/**
 * Read-only display page (hasDisplayPage: true). Edit/delete run from edit mode.
 */
export class PurchaseRequestDisplayPage extends BasePage {
  constructor(page: Page, id?: number | string) {
    super(page, id ? PURCHASE_REQUEST_ROUTES.display(id) : PURCHASE_REQUEST_ROUTES.list());
  }

  async open(id: number | string) {
    await this.page.goto(PURCHASE_REQUEST_ROUTES.display(id));
    await this.waitForAppReady();
  }

  async clickEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.waitForURL(/\/purchase-request\/\d+\/edit/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async searchItems(query: string) {
    const searchBtn = this.page.locator('button[title="Search"]').first();
    if (await searchBtn.isVisible()) {
      await searchBtn.click();
    }
    const searchInput = this.page.locator('input[placeholder="Search..."]').first();
    await searchInput.fill(query);
  }

  async expectItemVisible(itemName: string) {
    await this.page.getByText(itemName, { exact: false }).first().waitFor({ state: 'visible', timeout: 15_000 });
  }
}
