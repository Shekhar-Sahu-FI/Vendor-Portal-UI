import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { PRIORITY_MASTER_ROUTES, PRIORITY_GRID } from './priority-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class PriorityMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, PRIORITY_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(PRIORITY_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(PRIORITY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(priorityName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      PRIORITY_GRID.priorityNameFilterPlaceholder,
      priorityName,
      { listUrlPattern: /\/api\/master\/priorities/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: PRIORITY_GRID.priorityNameColumn,
      value: priorityName,
    });
    await this.waitForAppReady();
  }
}
