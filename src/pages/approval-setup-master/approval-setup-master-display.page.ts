import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { APPROVAL_SETUP_MASTER_ROUTES } from './approval-setup-master.constants';

export class ApprovalSetupMasterDisplayPage extends BasePage {
  constructor(page: Page, id?: number | string) {
    super(page, id ? APPROVAL_SETUP_MASTER_ROUTES.display(id) : APPROVAL_SETUP_MASTER_ROUTES.list());
  }

  async open(id: number | string): Promise<void> {
    await this.page.goto(APPROVAL_SETUP_MASTER_ROUTES.display(id));
    await this.waitForAppReady();
  }

  async clickEdit(): Promise<void> {
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await this.page.waitForURL(/\/approval-setup-master\/\d+\/edit/, { timeout: 30_000 });
    await this.waitForAppReady();
  }
}
