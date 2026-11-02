import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { COST_CENTER_MASTER_ROUTES, COST_CENTER_GRID } from './cost-center-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class CostCenterMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, COST_CENTER_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(COST_CENTER_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(COST_CENTER_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(costCenterName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      COST_CENTER_GRID.costCenterNameFilterPlaceholder,
      costCenterName,
      { listUrlPattern: /\/api\/cost-centers/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: COST_CENTER_GRID.costCenterNameColumn,
      value: costCenterName,
    });
    await this.waitForAppReady();
  }
}
