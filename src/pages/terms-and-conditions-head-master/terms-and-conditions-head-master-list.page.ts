import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import {
  TERMS_AND_CONDITIONS_HEAD_MASTER_ROUTES,
  TERMS_AND_CONDITIONS_HEAD_GRID,
} from './terms-and-conditions-head-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class TermsAndConditionsHeadMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, TERMS_AND_CONDITIONS_HEAD_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(TERMS_AND_CONDITIONS_HEAD_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(TERMS_AND_CONDITIONS_HEAD_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(tncHeadName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      TERMS_AND_CONDITIONS_HEAD_GRID.tncHeadNameFilterPlaceholder,
      tncHeadName,
      { listUrlPattern: /\/api\/master\/terms-and-condition-heads/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: TERMS_AND_CONDITIONS_HEAD_GRID.tncHeadNameColumn,
      value: tncHeadName,
    });
    await this.waitForAppReady();
  }
}
