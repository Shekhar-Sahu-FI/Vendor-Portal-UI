import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { UNIT_MASTER_ROUTES, UNIT_GRID } from './unit-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class UnitMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, UNIT_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(UNIT_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(UNIT_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(unitName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      UNIT_GRID.unitNameFilterPlaceholder,
      unitName,
      { listUrlPattern: /\/api\/units/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: UNIT_GRID.unitNameColumn,
      value: unitName,
    });
    await this.waitForAppReady();
  }
}
