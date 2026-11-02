import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { ITEM_CATEGORY_MASTER_ROUTES, ITEM_CATEGORY_GRID } from './item-category-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class ItemCategoryMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, ITEM_CATEGORY_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(ITEM_CATEGORY_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(ITEM_CATEGORY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(code: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      ITEM_CATEGORY_GRID.codeFilterPlaceholder,
      code,
      { listUrlPattern: /\/api\/master\/categories/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: ITEM_CATEGORY_GRID.codeColumn,
      value: code,
      exact: true,
    });
    await this.waitForAppReady();
  }
}
