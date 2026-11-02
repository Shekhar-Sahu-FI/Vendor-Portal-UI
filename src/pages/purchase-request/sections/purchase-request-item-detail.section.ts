import { Page } from '@playwright/test';
import { PurchaseRequestItemRowData } from '../../../types/purchase-request.types';
import { DataCellTable } from '../../../utils/data-cell-table';
import {
  PR_ITEM_GRID_COLUMNS,
  PR_ITEM_GRID_OVERLAY_PLACEHOLDERS,
} from '../grids/purchase-request-grid.columns';

export class PurchaseRequestItemDetailSection {
  private readonly table: DataCellTable<typeof PR_ITEM_GRID_COLUMNS>;

  constructor(page: Page) {
    this.table = new DataCellTable(page, PR_ITEM_GRID_COLUMNS);
  }

  async fillRow(rowIndex: number, row: PurchaseRequestItemRowData): Promise<void> {
    if (row.item) {
      await this.table.selectSuggestion(rowIndex, 'itemName', row.item.query, row.item.value);
    }
    if (row.requiredQty) {
      await this.table.fillInput(rowIndex, 'requiredQty', row.requiredQty);
    }
    if (row.prQty) {
      await this.table.fillInput(rowIndex, 'prQty', row.prQty);
    }
    if (row.rate) {
      await this.table.fillInput(rowIndex, 'rate', row.rate);
    }
    if (row.techSpecification) {
      await this.table.fillTextareaOverlayCell(
        rowIndex,
        'techSpecification',
        row.techSpecification,
        PR_ITEM_GRID_OVERLAY_PLACEHOLDERS.techSpecification,
      );
    }
    if (row.scheduleDate) {
      await this.table.selectDateInCell(rowIndex, 'scheduleDate', row.scheduleDate);
    }
    if (row.costCenter) {
      await this.table.selectSuggestion(
        rowIndex,
        'costCenterName',
        row.costCenter.query,
        row.costCenter.value,
      );
    }
    if (row.priority) {
      await this.table.selectSuggestion(rowIndex, 'priorityId', row.priority.query, row.priority.value);
    }
    if (row.remarks) {
      await this.table.fillTextareaOverlayCell(
        rowIndex,
        'remarks',
        row.remarks,
        PR_ITEM_GRID_OVERLAY_PLACEHOLDERS.remarks,
      );
    }
    await this.table.page.keyboard.press('Tab');
  }

  async fillAll(rows: PurchaseRequestItemRowData[] = []): Promise<void> {
    for (let i = 0; i < rows.length; i++) {
      await this.fillRow(i, rows[i]);
    }
  }
}
