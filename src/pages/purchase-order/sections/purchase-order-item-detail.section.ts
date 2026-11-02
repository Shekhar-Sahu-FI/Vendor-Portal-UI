import { Page } from '@playwright/test';
import { PurchaseOrderItemRowData } from '../../../types/purchase-order.types';
import { DataCellTable } from '../../../utils/data-cell-table';
import { selectDateFromCalendar } from '../../../utils/date-calendar.helper';
import {
  PO_ITEM_GRID_COLUMNS,
  PO_ITEM_GRID_OVERLAY_PLACEHOLDERS,
} from '../grids/purchase-order-grid.columns';

const SCHEDULE_DATE_CELL_ID = 'cell-0-scheduleDate';

export class PurchaseOrderItemDetailSection {
  private readonly table: DataCellTable<typeof PO_ITEM_GRID_COLUMNS>;

  constructor(page: Page) {
    this.table = new DataCellTable(page, PO_ITEM_GRID_COLUMNS);
  }

  private itemScheduleModal() {
    return this.table.page
      .locator('[role="dialog"]')
      .filter({ has: this.table.page.getByRole('heading', { name: /Item Schedule/i }) })
      .last();
  }

  private async fillScheduleDateFromModal(rowIndex: number, scheduleDate: string): Promise<void> {
    await this.table.clickInCell(rowIndex, 'schedule', 'button');
    const modal = this.itemScheduleModal();
    await modal.waitFor({ state: 'visible' });

    const scheduleDateCell = modal.locator(`[data-cell-id="${SCHEDULE_DATE_CELL_ID}"]`);
    await scheduleDateCell.scrollIntoViewIfNeeded();
    await scheduleDateCell.getByRole('button').click();
    await selectDateFromCalendar(this.table.page, scheduleDate);
    await modal.getByRole('button', { name: /^OK$/i }).click();
  }

  async fillRow(rowIndex: number, row: PurchaseOrderItemRowData): Promise<void> {
    if (row.item) {
      await this.table.selectSuggestion(rowIndex, 'itemName', row.item.query, row.item.value);
    }
    if (row.make) {
      await this.table.selectSuggestion(rowIndex, 'makeName', row.make.query, row.make.value);
    }
    if (row.techSpecification) {
      await this.table.fillTextareaOverlayCell(
        rowIndex,
        'techSpecification',
        row.techSpecification,
        PO_ITEM_GRID_OVERLAY_PLACEHOLDERS.techSpecification,
      );
    }
    if (row.qty !== undefined && row.qty !== null) {
      await this.table.fillInput(rowIndex, 'qty', String(row.qty));
    }
    if (row.scheduleDate) {
      await this.fillScheduleDateFromModal(rowIndex, row.scheduleDate);
    }
    if (row.unit) {
      await this.table.selectSuggestion(rowIndex, 'unitCode', row.unit.query, row.unit.value);
    }
    if (row.rate !== undefined && row.rate !== null) {
      await this.table.fillInput(rowIndex, 'rate', String(row.rate));
    }
    if (row.costCenter) {
      await this.table.selectSuggestion(
        rowIndex,
        'costCenterName',
        row.costCenter.query,
        row.costCenter.value,
      );
    }
    if (row.remarks) {
      await this.table.fillTextareaOverlayCell(
        rowIndex,
        'remarks',
        row.remarks,
        PO_ITEM_GRID_OVERLAY_PLACEHOLDERS.remarks,
      );
    }
    await this.table.page.keyboard.press('Tab');
  }

  async fillAll(rows: PurchaseOrderItemRowData[] = []): Promise<void> {
    for (let i = 0; i < rows.length; i++) {
      await this.fillRow(i, rows[i]);
    }
  }
}
