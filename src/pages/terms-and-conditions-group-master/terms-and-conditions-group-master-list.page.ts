import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import {
  TERMS_AND_CONDITIONS_GROUP_MASTER_ROUTES,
  TERMS_AND_CONDITIONS_GROUP_GRID,
} from './terms-and-conditions-group-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class TermsAndConditionsGroupMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, TERMS_AND_CONDITIONS_GROUP_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(TERMS_AND_CONDITIONS_GROUP_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(TERMS_AND_CONDITIONS_GROUP_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(tncGroupName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      TERMS_AND_CONDITIONS_GROUP_GRID.tncGroupNameFilterPlaceholder,
      tncGroupName,
      { listUrlPattern: /\/api\/master\/terms-and-condition-groups/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: TERMS_AND_CONDITIONS_GROUP_GRID.tncGroupNameColumn,
      value: tncGroupName,
    });
    await this.waitForAppReady();
  }
}
