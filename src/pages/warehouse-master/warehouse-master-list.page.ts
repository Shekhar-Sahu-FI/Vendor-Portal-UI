import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { WAREHOUSE_MASTER_ROUTES, WAREHOUSE_GRID } from './warehouse-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class WarehouseMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, WAREHOUSE_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open() {
    await this.page.goto(WAREHOUSE_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew() {
    await this.page.goto(WAREHOUSE_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(warehouseName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      WAREHOUSE_GRID.warehouseNameFilterPlaceholder,
      warehouseName,
      { listUrlPattern: /\/api\/master\/warehouses/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: WAREHOUSE_GRID.warehouseNameColumn,
      value: warehouseName,
    });
    await this.waitForAppReady();
  }
}
