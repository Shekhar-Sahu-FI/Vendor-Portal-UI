import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { ITEM_GROUP_MASTER_ROUTES, ITEM_GROUP_GRID } from './item-group-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class ItemGroupMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, ITEM_GROUP_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(ITEM_GROUP_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(ITEM_GROUP_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(codeOrGroupName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      ITEM_GROUP_GRID.groupNameFilterPlaceholder,
      codeOrGroupName,
      { listUrlPattern: /\/api\/master\/groups/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: ITEM_GROUP_GRID.groupNameColumn,
      value: codeOrGroupName,
    });
    await this.waitForAppReady();
  }
}
