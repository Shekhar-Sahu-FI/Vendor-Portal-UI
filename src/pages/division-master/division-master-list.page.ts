import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { DIVISION_MASTER_ROUTES, DIVISION_GRID } from './division-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class DivisionMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, DIVISION_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(DIVISION_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(DIVISION_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(divisionNameOrCode: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      DIVISION_GRID.divisionNameFilterPlaceholder,
      divisionNameOrCode,
      { listUrlPattern: /\/api\/master\/divisions/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: DIVISION_GRID.divisionNameColumn,
      value: divisionNameOrCode,
    });
    await this.waitForAppReady();
  }
}
