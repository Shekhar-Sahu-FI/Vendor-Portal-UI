import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { FINANCIAL_YEAR_MASTER_ROUTES, FINANCIAL_YEAR_GRID } from './financial-year-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class FinancialYearMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, FINANCIAL_YEAR_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(FINANCIAL_YEAR_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(FINANCIAL_YEAR_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(finYearName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      FINANCIAL_YEAR_GRID.finYearNameFilterPlaceholder,
      finYearName,
      { listUrlPattern: /\/api\/master\/financial-years/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: FINANCIAL_YEAR_GRID.finYearNameColumn,
      value: finYearName,
    });
    await this.waitForAppReady();
  }
}
