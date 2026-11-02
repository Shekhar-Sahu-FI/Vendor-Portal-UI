import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { VENDOR_LOCATION_MASTER_ROUTES, VENDOR_LOCATION_GRID } from './vendor-location-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class VendorLocationMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, VENDOR_LOCATION_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(VENDOR_LOCATION_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(VENDOR_LOCATION_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(locationOrVendorName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      VENDOR_LOCATION_GRID.vendorNameFilterPlaceholder,
      locationOrVendorName,
      { listUrlPattern: /\/api\/master\/vendor-locations/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: VENDOR_LOCATION_GRID.vendorNameColumn,
      value: locationOrVendorName,
    });
    await this.waitForAppReady();
  }
}
