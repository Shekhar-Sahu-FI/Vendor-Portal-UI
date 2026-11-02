import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { PURCHASE_ORDER_ROUTES } from './purchase-order.constants';

export class PurchaseOrderDisplayPage extends BasePage {
  constructor(page: Page, id?: number | string) {
    super(page, id ? PURCHASE_ORDER_ROUTES.display(id) : PURCHASE_ORDER_ROUTES.list());
  }

  async open(id: number | string) {
    await this.page.goto(PURCHASE_ORDER_ROUTES.display(id));
    await this.waitForAppReady();
  }

  async clickEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.waitForURL(/\/purchase-order\/\d+\/edit/, { timeout: 30_000 });
    await this.waitForAppReady();
  }
}
