import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { STATE_MASTER_ROUTES, STATE_GRID } from './state-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class StateMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, STATE_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(STATE_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(STATE_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(stateName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      STATE_GRID.stateNameFilterPlaceholder,
      stateName,
      { listUrlPattern: /\/api\/master\/states/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: STATE_GRID.stateNameColumn,
      value: stateName,
    });
    await this.waitForAppReady();
  }
}
