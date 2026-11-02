import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { CURRENCY_MASTER_ROUTES, CURRENCY_GRID } from './currency-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class CurrencyMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, CURRENCY_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(CURRENCY_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(CURRENCY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(currencyName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      CURRENCY_GRID.currencyNameFilterPlaceholder,
      currencyName,
      { listUrlPattern: /\/api\/master\/currencies/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: CURRENCY_GRID.currencyNameColumn,
      value: currencyName,
    });
    await this.waitForAppReady();
  }
}
