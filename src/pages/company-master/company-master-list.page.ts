import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { COMPANY_MASTER_ROUTES, COMPANY_GRID } from './company-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class CompanyMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, COMPANY_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(COMPANY_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(COMPANY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(companyName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      COMPANY_GRID.companyNameFilterPlaceholder,
      companyName,
      { listUrlPattern: /\/api\/master\/companies/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: COMPANY_GRID.companyNameColumn,
      value: companyName,
    });
    await this.waitForAppReady();
  }
}
