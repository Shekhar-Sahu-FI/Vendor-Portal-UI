import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { VENDOR_MASTER_ROUTES, VENDOR_MASTER_GRID } from './vendor-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class VendorMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, VENDOR_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(VENDOR_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(VENDOR_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(vendorName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      VENDOR_MASTER_GRID.vendorNameFilterPlaceholder,
      vendorName,
      { listUrlPattern: /\/api\/master\/vendor/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: VENDOR_MASTER_GRID.vendorNameColumn,
      value: vendorName,
    });
    await this.waitForAppReady();
  }
}
