import { Page } from '@playwright/test';
import { ApprovalSetupLevelRowData } from '../../../types/approval-setup-master.types';
import { ASM_LEVEL_GRID_COLUMNS } from '../grids/approval-setup-master-grid.columns';
import { DataCellTable } from '../../../utils/data-cell-table';
import { selectDropdownInCell } from '../approval-setup-grid.helper';
import { ApprovalSetupUserModalSection } from './approval-setup-user-modal.section';

export class ApprovalSetupLevelDetailSection {
  private readonly table: DataCellTable<typeof ASM_LEVEL_GRID_COLUMNS>;
  private readonly userModal: ApprovalSetupUserModalSection;

  constructor(private readonly page: Page) {
    this.table = new DataCellTable(page, ASM_LEVEL_GRID_COLUMNS);
    this.userModal = new ApprovalSetupUserModalSection(page);
  }

  async fillRow(rowIndex: number, row: ApprovalSetupLevelRowData): Promise<void> {
    if (row.printingCaption) {
      await this.table.fillInput(rowIndex, 'printingCaption', row.printingCaption);
    }
    if (row.approvalRule) {
      await selectDropdownInCell(
        this.table.cell(rowIndex, 'approvalRuleId'),
        row.approvalRule,
      );
    }
    if (row.isNextLevelSelectable) {
      const checkbox = this.table
        .cell(rowIndex, 'isNextLevelSelectionAllowed')
        .locator('input[type="checkbox"]')
        .first();
      await checkbox.check();
    }
    if (row.users?.length) {
      await this.table.clickInCell(rowIndex, 'userDetail', 'button');
      await this.userModal.waitForOpen(rowIndex + 1);
      await this.userModal.fillAll(row.users);
      await this.userModal.done();
    }
  }

  async fillAll(rows: ApprovalSetupLevelRowData[] = []): Promise<void> {
    for (let i = 0; i < rows.length; i++) {
      await this.fillRow(i, rows[i]);
    }
  }
}
