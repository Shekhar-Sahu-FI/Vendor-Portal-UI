import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { QUOTATION_ROUTES } from './quotation.constants';

export class QuotationDisplayPage extends BasePage {
  constructor(page: Page, id?: number | string) {
    super(page, id ? QUOTATION_ROUTES.display(id) : QUOTATION_ROUTES.list());
  }

  async open(id: number | string, role: string = 'vendor') {
    await this.page.goto(QUOTATION_ROUTES.display(id, role));
    await this.waitForAppReady();
  }

  async clickEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.waitForURL(/\/quotation\/\d+\/edit/, { timeout: 30_000 });
    await this.waitForAppReady();
  }
}
