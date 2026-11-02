import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { ANNOUNCEMENT_MASTER_ROUTES, ANNOUNCEMENT_GRID } from './announcement-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class AnnouncementMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, ANNOUNCEMENT_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(ANNOUNCEMENT_MASTER_ROUTES.list());
    await this.waitForAppReady();
  }

  async createNew(): Promise<void> {
    await this.page.goto(ANNOUNCEMENT_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(titleOrCode: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      ANNOUNCEMENT_GRID.titleFilterPlaceholder,
      titleOrCode,
      { listUrlPattern: /\/api\/master\/announcement/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: ANNOUNCEMENT_GRID.titleColumn,
      value: titleOrCode,
    });
    await this.waitForAppReady();
  }
}
