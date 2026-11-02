import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { REQUEST_FOR_QUOTATION_ROUTES } from './request-for-quotation.constants';

export class RequestForQuotationDisplayPage extends BasePage {
  constructor(page: Page, id?: number | string) {
    super(page, id ? REQUEST_FOR_QUOTATION_ROUTES.display(id) : REQUEST_FOR_QUOTATION_ROUTES.list());
  }

  async open(id: number | string) {
    await this.page.goto(REQUEST_FOR_QUOTATION_ROUTES.display(id));
    await this.waitForAppReady();
  }

  async clickEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.waitForURL(/\/request-for-quotation\/\d+\/edit/, { timeout: 30_000 });
    await this.waitForAppReady();
  }
}
