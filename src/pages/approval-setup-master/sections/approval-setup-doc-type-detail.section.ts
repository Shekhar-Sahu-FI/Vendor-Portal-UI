import { Page } from '@playwright/test';
import { DOC_TYPE_DETAIL_LABELS as L } from '../approval-setup-master.constants';
import {
  approvalSetupSection,
  selectSectionGridRow,
  selectSectionGridRowsByText,
} from '../approval-setup-grid.helper';

export class ApprovalSetupDocTypeDetailSection {
  private readonly scope;

  constructor(private readonly page: Page) {
    this.scope = approvalSetupSection(page, L.sectionTitle);
  }

  async isVisible(): Promise<boolean> {
    return this.scope.isVisible().catch(() => false);
  }

  async selectFirstRow(): Promise<void> {
    await selectSectionGridRow(this.scope, 0);
  }

  async selectByNames(docTypeNames: string[]): Promise<void> {
    await selectSectionGridRowsByText(this.scope, docTypeNames);
  }

  async fillAll(docTypeRows: string[] = []): Promise<void> {
    if (!(await this.isVisible())) {
      return;
    }
    if (docTypeRows.length) {
      await this.selectByNames(docTypeRows);
      return;
    }
    await this.selectFirstRow();
  }
}
