import { Page } from '@playwright/test';
import { COMPANY_DETAIL_LABELS as L } from '../approval-setup-master.constants';
import {
  approvalSetupSection,
  selectSectionGridRow,
  selectSectionGridRowsByText,
} from '../approval-setup-grid.helper';

export class ApprovalSetupCompanyDetailSection {
  private readonly scope;

  constructor(private readonly page: Page) {
    this.scope = approvalSetupSection(page, L.sectionTitle);
  }

  async selectFirstRow(): Promise<void> {
    await selectSectionGridRow(this.scope, 0);
  }

  async selectByNames(companyNames: string[]): Promise<void> {
    await selectSectionGridRowsByText(this.scope, companyNames);
  }

  async fillAll(companyRows: string[] = []): Promise<void> {
    if (companyRows.length) {
      await this.selectByNames(companyRows);
      return;
    }
    await this.selectFirstRow();
  }
}
