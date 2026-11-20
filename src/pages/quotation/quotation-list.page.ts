import { Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { GridHelper } from '../../utils/grid.helper';
import { QUOTATION_GRID, QUOTATION_ROUTES } from './quotation.constants';
import { QuotationDisplayPage } from './quotation-display.page';

export class QuotationListPage extends FormLayoutPage {
  readonly grid: GridHelper;
  readonly display: QuotationDisplayPage;

  constructor(page: Page) {
    super(page, QUOTATION_ROUTES.list());
    this.grid = new GridHelper(page);
    this.display = new QuotationDisplayPage(page);
  }

  async open(role: string = 'vendor') {
    await this.page.goto(QUOTATION_ROUTES.list(role));
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async openRecordDisplay(docNo: string) {
    await this.grid.openRowByDocNo(docNo, QUOTATION_GRID.docNoColumn);
    await this.page.waitForURL(/\/quotation\/\d+(?!\/edit)/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openFirstRecordDisplay() {
    await this.grid.openFirstRow();
    await this.page.waitForURL(/\/quotation\/\d+/, { timeout: 30_000 });
    await this.waitForAppReady();
  }
}
