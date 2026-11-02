import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { CITY_MASTER_ROUTES, CITY_GRID } from './city-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class CityMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, CITY_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(CITY_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(CITY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(cityName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      CITY_GRID.cityNameFilterPlaceholder,
      cityName,
      { listUrlPattern: /\/api\/master\/cities/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: CITY_GRID.cityNameColumn,
      value: cityName,
    });
    await this.waitForAppReady();
  }
}
