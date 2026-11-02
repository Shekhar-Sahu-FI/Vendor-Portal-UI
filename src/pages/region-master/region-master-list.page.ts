import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { REGION_MASTER_ROUTES, REGION_GRID } from './region-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class RegionMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, REGION_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(REGION_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(REGION_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(regionName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      REGION_GRID.regionNameFilterPlaceholder,
      regionName,
      { listUrlPattern: /\/api\/master\/regions/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: REGION_GRID.regionNameColumn,
      value: regionName,
    });
    await this.waitForAppReady();
  }
}
