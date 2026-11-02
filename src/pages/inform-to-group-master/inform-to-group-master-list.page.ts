import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { INFORM_TO_GROUP_MASTER_ROUTES, INFORM_TO_GROUP_GRID } from './inform-to-group-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class InformToGroupMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, INFORM_TO_GROUP_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(INFORM_TO_GROUP_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(INFORM_TO_GROUP_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(groupName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      INFORM_TO_GROUP_GRID.groupNameFilterPlaceholder,
      groupName,
      { listUrlPattern: /\/api\/master\/inform-to-group-master/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: INFORM_TO_GROUP_GRID.groupNameColumn,
      value: groupName,
    });
    await this.waitForAppReady();
  }
}
