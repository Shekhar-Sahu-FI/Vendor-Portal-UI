import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { DEPARTMENT_MASTER_ROUTES, DEPARTMENT_GRID } from './department-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class DepartmentMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, DEPARTMENT_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(DEPARTMENT_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(DEPARTMENT_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(deptNameOrCode: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      DEPARTMENT_GRID.departmentNameFilterPlaceholder,
      deptNameOrCode,
      { listUrlPattern: /\/api\/master\/departments/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: DEPARTMENT_GRID.departmentNameColumn,
      value: deptNameOrCode,
    });
    await this.waitForAppReady();
  }
}
