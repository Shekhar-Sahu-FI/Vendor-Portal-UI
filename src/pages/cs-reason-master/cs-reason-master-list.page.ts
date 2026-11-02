import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { CS_REASON_MASTER_ROUTES, CS_REASON_GRID } from './cs-reason-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class CSReasonMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, CS_REASON_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(CS_REASON_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(CS_REASON_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(reasonName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      CS_REASON_GRID.reasonNameFilterPlaceholder,
      reasonName,
      { listUrlPattern: /\/api\/master\/cs-reasons/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: CS_REASON_GRID.reasonNameColumn,
      value: reasonName,
    });
    await this.waitForAppReady();
  }
}
