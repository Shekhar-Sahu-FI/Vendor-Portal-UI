import { Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { GridHelper } from '../../utils/grid.helper';
import { PURCHASE_ORDER_GRID, PURCHASE_ORDER_ROUTES } from './purchase-order.constants';
import { PurchaseOrderDisplayPage } from './purchase-order-display.page';

export class PurchaseOrderListPage extends FormLayoutPage {
  readonly grid: GridHelper;
  readonly display: PurchaseOrderDisplayPage;

  constructor(page: Page) {
    super(page, PURCHASE_ORDER_ROUTES.list());
    this.grid = new GridHelper(page);
    this.display = new PurchaseOrderDisplayPage(page);
  }

  async open() {
    await this.goto();
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew() {
    await this.addNewButton().click();
    await this.page.waitForURL(/\/purchase-order\/new/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openRecordDisplay(docNo: string) {
    await this.grid.openRowByDocNo(docNo, PURCHASE_ORDER_GRID.docNoColumn);
    await this.page.waitForURL(/\/purchase-order\/\d+(?!\/edit)/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openFirstRecordDisplay() {
    await this.grid.openFirstRow();
    await this.page.waitForURL(/\/purchase-order\/\d+/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openFirstRecordForEdit() {
    await this.openFirstRecordDisplay();
    await this.display.clickEdit();
  }

  async openRecordForEdit(docNoOrText: string) {
    await this.openRecordDisplay(docNoOrText);
    await this.display.clickEdit();
  }
}
