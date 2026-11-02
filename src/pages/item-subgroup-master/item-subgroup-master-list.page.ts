import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { ITEM_SUBGROUP_MASTER_ROUTES, ITEM_SUBGROUP_GRID } from './item-subgroup-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class ItemSubgroupMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, ITEM_SUBGROUP_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(ITEM_SUBGROUP_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(ITEM_SUBGROUP_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(subgroupName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      ITEM_SUBGROUP_GRID.subgroupNameFilterPlaceholder,
      subgroupName,
      { listUrlPattern: /\/api\/master\/subgroups/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: ITEM_SUBGROUP_GRID.subgroupNameColumn,
      value: subgroupName,
    });
    await this.waitForAppReady();
  }
}
