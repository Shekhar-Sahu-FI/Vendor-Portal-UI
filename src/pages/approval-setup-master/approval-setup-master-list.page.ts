import { Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { GridHelper } from '../../utils/grid.helper';
import { APPROVAL_SETUP_MASTER_GRID, APPROVAL_SETUP_MASTER_ROUTES } from './approval-setup-master.constants';
import { ApprovalSetupMasterDisplayPage } from './approval-setup-master-display.page';

export class ApprovalSetupMasterListPage extends FormLayoutPage {
  readonly grid: GridHelper;
  readonly display: ApprovalSetupMasterDisplayPage;

  constructor(page: Page) {
    super(page, APPROVAL_SETUP_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
    this.display = new ApprovalSetupMasterDisplayPage(page);
  }

  async open(): Promise<void> {
    await this.goto();
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.addNewButton().click();
    await this.page.waitForURL(/\/approval-setup-master\/new/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openFirstRecordForEdit(): Promise<void> {
    await this.grid.openFirstRow();
    await this.page.waitForURL(/\/approval-setup-master\/\d+(?!\/edit)/, { timeout: 30_000 });
    await this.waitForAppReady();
    await this.display.clickEdit();
  }

  async openSavedRecordForEdit(
    code: string,
    filterPlaceholder = APPROVAL_SETUP_MASTER_GRID.codeFilterPlaceholder,
  ): Promise<void> {
    await this.grid.filterByColumnPlaceholder(filterPlaceholder, code, {
      listUrlPattern: /approval-setups/i,
    });
    await this.grid.openFirstRow();
    await this.page.waitForURL(/\/approval-setup-master\/\d+(?!\/edit)/, { timeout: 30_000 });
    await this.waitForAppReady();
    await this.display.clickEdit();
    await this.page.waitForURL(/\/approval-setup-master\/\d+\/edit/, { timeout: 30_000 });
    await this.waitForAppReady();
  }
}
