import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { VENDOR_REGISTRATION_ROUTES, VENDOR_REGISTRATION_GRID } from './vendor-registration.constants';
import { GridHelper } from '../../utils/grid.helper';

export class VendorRegistrationListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, VENDOR_REGISTRATION_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(VENDOR_REGISTRATION_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(VENDOR_REGISTRATION_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(vendorName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      VENDOR_REGISTRATION_GRID.vendorNameFilterPlaceholder,
      vendorName,
      { listUrlPattern: /\/api\/master\/vendor/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: VENDOR_REGISTRATION_GRID.vendorNameColumn,
      value: vendorName,
    });
    await this.waitForAppReady();
  }
}
