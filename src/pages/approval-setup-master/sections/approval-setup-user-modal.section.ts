import { Page, expect } from '@playwright/test';
import { ApprovalSetupUserRowData } from '../../../types/approval-setup-master.types';
import { USER_MODAL_LABELS as L } from '../approval-setup-master.constants';
import { ASM_USER_MODAL_GRID_COLUMNS } from '../grids/approval-setup-master-grid.columns';
import { DataCellTable } from '../../../utils/data-cell-table';
import { manageUsersModal, selectDropdownInCell } from '../approval-setup-grid.helper';

export class ApprovalSetupUserModalSection {
  private readonly table: DataCellTable<typeof ASM_USER_MODAL_GRID_COLUMNS>;

  constructor(private readonly page: Page) {
    this.table = new DataCellTable(page, ASM_USER_MODAL_GRID_COLUMNS);
  }

  private modalRoot() {
    return manageUsersModal(this.page);
  }

  async waitForOpen(levelNo = 1): Promise<void> {
    await expect(this.modalRoot()).toBeVisible({ timeout: 15_000 });
    await expect(this.modalRoot().getByText(`Manage Users for Level ${levelNo}`)).toBeVisible();
  }

  async fillRow(rowIndex: number, row: ApprovalSetupUserRowData): Promise<void> {
    if (row.approverType) {
      await selectDropdownInCell(
        this.table.cell(rowIndex, 'approverTypeId'),
        row.approverType,
      );
    }
    if (row.approverName) {
      await this.table.selectSuggestion(
        rowIndex,
        'approverName',
        row.approverName.query,
        row.approverName.value,
      );
    }
    if (row.isDefault) {
      const checkbox = this.table.cell(rowIndex, 'isDefault').locator('input[type="checkbox"]').first();
      await checkbox.check();
    }
  }

  async fillAll(users: ApprovalSetupUserRowData[] = []): Promise<void> {
    for (let i = 0; i < users.length; i++) {
      await this.fillRow(i, users[i]);
    }
  }

  async done(): Promise<void> {
    await this.modalRoot().getByRole('button', { name: L.doneButton }).click();
    await expect(this.modalRoot()).toBeHidden({ timeout: 15_000 });
  }
}
