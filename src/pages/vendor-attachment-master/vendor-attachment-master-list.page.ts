import { Page } from '@playwright/test';
import { BasePage } from '../base/base.page';
import {
  VENDOR_ATTACHMENT_MASTER_ROUTES,
  VENDOR_ATTACHMENT_GRID,
} from './vendor-attachment-master.constants';
import { GridHelper } from '../../utils/grid.helper';

export class VendorAttachmentMasterListPage extends BasePage {
  readonly grid: GridHelper;

  constructor(page: Page) {
    super(page, VENDOR_ATTACHMENT_MASTER_ROUTES.list());
    this.grid = new GridHelper(page);
  }

  async open(): Promise<void> {
    await this.page.goto(VENDOR_ATTACHMENT_MASTER_ROUTES.list());
    await this.waitForAppReady();
    await this.grid.waitForLoaded();
  }

  async createNew(): Promise<void> {
    await this.page.goto(VENDOR_ATTACHMENT_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openSavedRecordForEdit(documentName: string): Promise<void> {
    await this.grid.filterByColumnPlaceholder(
      VENDOR_ATTACHMENT_GRID.documentNameFilterPlaceholder,
      documentName,
      { listUrlPattern: /\/api\/master\/vendor-attachments/i },
    );
    await this.grid.openRowByColumnValue({
      columnHeader: VENDOR_ATTACHMENT_GRID.documentNameColumn,
      value: documentName,
    });
    await this.waitForAppReady();
  }
}
