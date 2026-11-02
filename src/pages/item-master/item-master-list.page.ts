import { Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { GridHelper } from '../../utils/grid.helper';
import { ITEM_MASTER_GRID, ITEM_MASTER_ROUTES } from './item-master.constants';

export class ItemMasterListPage extends FormLayoutPage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, ITEM_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.goto();
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.addNewButton().click();
    await this.page.waitForURL(/\/item-master\/new/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  /**
   * Item Master list opens rows directly in edit mode (no display page).
   */
  async openFirstRecordForEdit(): Promise<void> {
    await this.grid.openFirstRow();
    await this.page.waitForURL(/\/item-master\/\d+\/edit/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(
    itemCode: string,
    filterPlaceholder = ITEM_MASTER_GRID.itemCodeFilterPlaceholder,
  ): Promise<void> {
    await this.grid.filterByColumnPlaceholder(filterPlaceholder, itemCode, {
      listUrlPattern: /\/api\/master\/items/i,
    });
    await this.grid.openFirstRow();
    await this.page.waitForURL(/\/item-master\/\d+\/edit/, { timeout: 30_000 });
    await this.waitForAppReady();
  }
}
