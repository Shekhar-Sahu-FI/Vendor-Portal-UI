import { Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { GridHelper } from '../../utils/grid.helper';
import {
  REQUEST_FOR_QUOTATION_GRID,
  REQUEST_FOR_QUOTATION_ROUTES,
} from './request-for-quotation.constants';
import { RequestForQuotationDisplayPage } from './request-for-quotation-display.page';

export class RequestForQuotationListPage extends FormLayoutPage {
  readonly grid: GridHelper;
  readonly display: RequestForQuotationDisplayPage;

  constructor(page: Page) {
    super(page, REQUEST_FOR_QUOTATION_ROUTES.list());
    this.grid = new GridHelper(page);
    this.display = new RequestForQuotationDisplayPage(page);
  }

  async open() {
    await this.goto();
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew() {
    await this.addNewButton().click();
    await this.page.waitForURL(/\/request-for-quotation\/new/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openRecordDisplay(docNo: string) {
    await this.grid.openRowByDocNo(docNo, REQUEST_FOR_QUOTATION_GRID.docNoColumn);
    await this.page.waitForURL(/\/request-for-quotation\/\d+(?!\/edit)/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openFirstRecordDisplay() {
    await this.grid.openFirstRow();
    await this.page.waitForURL(/\/request-for-quotation\/\d+/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openFirstRecordForEdit() {
    await this.openFirstRecordDisplay();
    await this.display.clickEdit();
  }
}
