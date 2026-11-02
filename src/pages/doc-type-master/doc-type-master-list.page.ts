import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { DOC_TYPE_MASTER_ROUTES, DOC_TYPE_GRID } from './doc-type-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class DocTypeMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, DOC_TYPE_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(DOC_TYPE_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(DOC_TYPE_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(docTypeName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      DOC_TYPE_GRID.docTypeNameFilterPlaceholder,
      docTypeName,
      { listUrlPattern: /\/api\/master\/doc-types/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: DOC_TYPE_GRID.docTypeNameColumn,
      value: docTypeName,
    });
    await this.waitForAppReady();
  }
}
