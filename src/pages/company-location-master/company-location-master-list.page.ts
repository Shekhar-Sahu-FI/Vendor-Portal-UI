import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { COMPANY_LOCATION_MASTER_ROUTES, COMPANY_LOCATION_GRID } from './company-location-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class CompanyLocationMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, COMPANY_LOCATION_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(COMPANY_LOCATION_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(COMPANY_LOCATION_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(companyOrAddress: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      COMPANY_LOCATION_GRID.address1FilterPlaceholder,
      companyOrAddress,
      { listUrlPattern: /\/api\/master\/company\/locations/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: COMPANY_LOCATION_GRID.address1Column,
      value: companyOrAddress,
    });
    await this.waitForAppReady();
  }
}
