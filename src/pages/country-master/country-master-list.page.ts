import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { COUNTRY_MASTER_ROUTES, COUNTRY_GRID } from './country-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class CountryMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, COUNTRY_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(COUNTRY_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(COUNTRY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(countryName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      COUNTRY_GRID.countryNameFilterPlaceholder,
      countryName,
      { listUrlPattern: /\/api\/master\/countries/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: COUNTRY_GRID.countryNameColumn,
      value: countryName,
    });
    await this.waitForAppReady();
  }
}
