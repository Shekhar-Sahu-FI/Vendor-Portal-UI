import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { VENDOR_CATEGORY_MASTER_ROUTES, VENDOR_CATEGORY_GRID } from './vendor-category-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class VendorCategoryMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, VENDOR_CATEGORY_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(VENDOR_CATEGORY_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(VENDOR_CATEGORY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(vendorCategoryName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      VENDOR_CATEGORY_GRID.vendorCategoryNameFilterPlaceholder,
      vendorCategoryName,
      { listUrlPattern: /\/api\/master\/vendor-categories/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: VENDOR_CATEGORY_GRID.vendorCategoryNameColumn,
      value: vendorCategoryName,
    });
    await this.waitForAppReady();
  }
}
