import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { MAKE_MASTER_ROUTES, MAKE_GRID } from './make-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class MakeMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, MAKE_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(MAKE_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(MAKE_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(makeName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      MAKE_GRID.makeNameFilterPlaceholder,
      makeName,
      { listUrlPattern: /\/api\/makes/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: MAKE_GRID.makeNameColumn,
      value: makeName,
    });
    await this.waitForAppReady();
  }
}
