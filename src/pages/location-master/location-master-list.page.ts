import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { LOCATION_MASTER_ROUTES, LOCATION_GRID } from './location-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class LocationMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, LOCATION_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(LOCATION_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(LOCATION_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(locationName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      LOCATION_GRID.locationNameFilterPlaceholder,
      locationName,
      { listUrlPattern: /\/api\/master\/locations/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: LOCATION_GRID.locationNameColumn,
      value: locationName,
    });
    await this.waitForAppReady();
  }
}
