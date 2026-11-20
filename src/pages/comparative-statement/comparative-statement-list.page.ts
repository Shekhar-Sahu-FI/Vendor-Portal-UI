import { Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { GridHelper } from '../../utils/grid.helper';
import { COMPARATIVE_STATEMENT_GRID, COMPARATIVE_STATEMENT_ROUTES } from './comparative-statement.constants';
import { ComparativeStatementDisplayPage } from './comparative-statement-display.page';

export class ComparativeStatementListPage extends FormLayoutPage {
  readonly grid: GridHelper;
  readonly display: ComparativeStatementDisplayPage;

  constructor(page: Page) {
    super(page, COMPARATIVE_STATEMENT_ROUTES.list());
    this.grid = new GridHelper(page);
    this.display = new ComparativeStatementDisplayPage(page);
  }

  async open(role: string = 'company') {
    await this.page.goto(COMPARATIVE_STATEMENT_ROUTES.list(role));
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async openRecordDisplay(docNo: string) {
    await this.grid.openRowByDocNo(docNo, COMPARATIVE_STATEMENT_GRID.docNoColumn);
    await this.page.waitForURL(/\/comparative-statement\/\d+(?!\/edit)/, { timeout: 30_000 });
    await this.waitForAppReady();
  }

  async openFirstRecordDisplay() {
    await this.grid.openFirstRow();
    await this.page.waitForURL(/\/comparative-statement\/\d+/, { timeout: 30_000 });
    await this.waitForAppReady();
  }
}

