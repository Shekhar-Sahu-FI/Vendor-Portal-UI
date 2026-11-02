import { Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { GridHelper } from '../../utils/grid.helper';
import { PURCHASE_REQUEST_GRID, PURCHASE_REQUEST_ROUTES } from './purchase-request.constants';
import { PurchaseRequestDisplayPage } from './purchase-request-display.page';

export class PurchaseRequestListPage extends FormLayoutPage {
  readonly grid: GridHelper;
  readonly display: PurchaseRequestDisplayPage;

  constructor(page: Page) {
    super(page, PURCHASE_REQUEST_ROUTES.list());
    this.grid = new GridHelper(page);
    this.display = new PurchaseRequestDisplayPage(page);
  }

  async open() {
    await this.goto();
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew() {
    await this.addNewButton().click();
    await this.page.waitForURL(/\/purchase-request\/new/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openRecordDisplay(docNo: string) {
    await this.grid.openRowByDocNo(docNo, PURCHASE_REQUEST_GRID.docNoColumn);
    await this.page.waitForURL(/\/purchase-request\/\d+(?!\/edit)/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openFirstRecordDisplay() {
    await this.grid.openFirstRow();
    await this.page.waitForURL(/\/purchase-request\/\d+/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  /** Opens list row → display → edit (required for update/delete on draft PRs). */
  async openFirstRecordForEdit() {
    await this.openFirstRecordDisplay();
    await this.display.clickEdit();
  }

  async openRecordForEdit(docNo: string) {
    await this.openRecordDisplay(docNo);
    await this.display.clickEdit();
  }

  /**
   * Filter list by doc-no column, open first row, then switch to edit mode.
   */
  async openSavedRecordForEdit(docNo: string, filterPlaceholder = PURCHASE_REQUEST_GRID.docNoFilterPlaceholder) {
    await this.grid.filterAndOpenFirstRow(filterPlaceholder, docNo);
    await this.page.waitForURL(/\/purchase-request\/\d+(?!\/edit)/, { timeout: 30_000 });
    await this.waitForAppReady();
    await this.display.clickEdit();
    await this.page.waitForURL(/\/purchase-request\/\d+\/edit/, { timeout: 30_000 });
    await this.waitForAppReady();
  }
}
