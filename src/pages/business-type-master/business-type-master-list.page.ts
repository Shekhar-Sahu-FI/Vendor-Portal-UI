import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { BUSINESS_TYPE_MASTER_ROUTES, BUSINESS_TYPE_GRID } from './business-type-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class BusinessTypeMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, BUSINESS_TYPE_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(BUSINESS_TYPE_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(BUSINESS_TYPE_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(businessTypeName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      BUSINESS_TYPE_GRID.businessTypeNameFilterPlaceholder,
      businessTypeName,
      { listUrlPattern: /\/api\/master\/businessTypes/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: BUSINESS_TYPE_GRID.businessTypeNameColumn,
      value: businessTypeName,
    });
    await this.waitForAppReady();
  }
}
