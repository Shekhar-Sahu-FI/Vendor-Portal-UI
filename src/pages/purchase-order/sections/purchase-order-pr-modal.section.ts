import { expect, Locator, Page } from '@playwright/test';
import { PurchaseOrderPrModalRowData } from '../../../types/purchase-order.types';
import { DataCellTable } from '../../../utils/data-cell-table';
import { PO_PR_MODAL_GRID_COLUMNS } from '../grids/purchase-order-grid.columns';
import { PURCHASE_ORDER_PR_MODAL_LABELS } from '../purchase-order.constants';
import { fillDateByLabel } from '../../../utils/date-calendar.helper';

export class PurchaseOrderPrModalSection {
  private readonly table: DataCellTable<typeof PO_PR_MODAL_GRID_COLUMNS>;

  constructor(private readonly page: Page) {
    this.table = new DataCellTable(page, PO_PR_MODAL_GRID_COLUMNS);
  }

  private title(): Locator {
    return this.page
      .locator('h1, h2, h3, h4, h5, h6')
      .filter({ hasText: new RegExp(PURCHASE_ORDER_PR_MODAL_LABELS.title, 'i') })
      .last();
  }

  private dialog(): Locator {
    // Align with uc-dialog-box.tsx markup:
    // backdrop: fixed top-0 left-0 ... z-modal
    // dialog body: relative flex flex-col bg-white ...
    return this.page
      .locator('div.fixed.top-0.left-0.w-full.h-full.z-modal')
      .filter({ has: this.title() })
      .locator('div.relative.flex.flex-col.bg-white')
      .first();
  }

  async waitForOpened(): Promise<void> {
    await expect(this.title()).toBeVisible({ timeout: 30_000 });
    await expect(this.dialog()).toBeVisible({ timeout: 30_000 });
    await expect(this.dialog().locator('tbody tr').first()).toBeVisible({ timeout: 30_000 });
  }

  async filterByDateRange(fromDate?: string, toDate?: string): Promise<void> {
    if (fromDate) {
      await fillDateByLabel(this.page, PURCHASE_ORDER_PR_MODAL_LABELS.fromDate, fromDate);
    }
    if (toDate) {
      await fillDateByLabel(this.page, PURCHASE_ORDER_PR_MODAL_LABELS.toDate, toDate);
    }
  }

  async clickShowPurchaseRequest(): Promise<void> {
    await this.dialog().getByRole('button', { name: PURCHASE_ORDER_PR_MODAL_LABELS.showPurchaseRequest }).click();
  }

  async searchByPrNo(prNo: string): Promise<void> {
    const dialog = this.dialog();
    const filterPrNoInput = dialog.getByPlaceholder('Filter PR No....').first();
    const fallbackSearchInput = dialog.getByPlaceholder('Search...').first();
    const targetInput = (await filterPrNoInput.count()) ? filterPrNoInput : fallbackSearchInput;
    if (!(await targetInput.count())) return;

    await targetInput.fill('');
    await targetInput.fill(prNo);
    await targetInput.press('Enter').catch(() => {});
    await this.page.waitForTimeout(400);
  }

  private checkboxByCellRowId(cellRowId: number): Locator {
    return this.dialog()
      .locator(`[data-cell-id="cell-${cellRowId}-select"]`)
      .locator('input[type="checkbox"]')
      .first();
  }

  private poQtyInputByCellRowId(cellRowId: number): Locator {
    return this.dialog()
      .locator(`[data-cell-id="cell-${cellRowId}-poQty"]`)
      .locator('input')
      .first();
  }

  async setRowSelection(cellRowId: number, selected: boolean): Promise<void> {
    const checkbox = this.checkboxByCellRowId(cellRowId);
    if (selected) {
      await checkbox.check({ force: true });
    } else {
      await checkbox.uncheck();
    }
  }

  private async findCellRowIdByLineNo(lineNo: string | number): Promise<number> {
    const lineNoText = String(lineNo).trim();
    const lineCells = this.dialog().locator('[data-cell-id$="-lineNo"]');
    const lineCellCount = await lineCells.count();
    for (let i = 0; i < lineCellCount; i++) {
      const cell = lineCells.nth(i);
      const dataCellId = (await cell.getAttribute('data-cell-id')) ?? '';
      const match = dataCellId.match(/^cell-(\d+)-lineNo$/);
      if (!match) continue;
      const cellRowId = Number(match[1]);
      const lineValue =
        ((await cell.getAttribute('title')) ?? (await cell.innerText()) ?? '').trim();
      if (lineValue === lineNoText) {
        return cellRowId;
      }
    }
    throw new Error(`PR modal row not found for Line No "${lineNoText}"`);
  }

  private async resolveCellRowId(row: PurchaseOrderPrModalRowData): Promise<number> {
    if (typeof row.rowIndex === 'number') return row.rowIndex;
    if (row.prNo && row.lineNo !== undefined && row.lineNo !== null) {
      await this.searchByPrNo(row.prNo);
      return this.findCellRowIdByLineNo(row.lineNo);
    }
    throw new Error('Provide either rowIndex or both prNo and lineNo for PR modal row selection');
  }

  async fillRow(row: PurchaseOrderPrModalRowData): Promise<void> {
    const cellRowId = await this.resolveCellRowId(row);

    const shouldSelect =
      typeof row.selected === 'boolean'
        ? row.selected
        : Boolean(row.prNo && row.lineNo !== undefined && row.lineNo !== null);

    if (shouldSelect) {
      await this.setRowSelection(cellRowId, true);
    } else if (row.selected === false) {
      await this.setRowSelection(cellRowId, false);
    }
    if (row.poMake) {
      await this.table.selectSuggestion(cellRowId, 'poMakeName', row.poMake.query, row.poMake.value);
    }
    if (row.poUnit) {
      await this.table.selectSuggestion(cellRowId, 'poUnitCode', row.poUnit.query, row.poUnit.value);
    }
    if (row.poQty) {
      const poQtyInput = this.poQtyInputByCellRowId(cellRowId);
      await poQtyInput.click();
      await poQtyInput.fill('');
      await poQtyInput.type(row.poQty, { delay: 40 });
    }
    await this.page.keyboard.press('Tab');
  }

  async fillRows(rows: PurchaseOrderPrModalRowData[] = []): Promise<void> {
    for (const row of rows) {
      await this.fillRow(row);
    }
  }

  async confirm(): Promise<void> {
    await this.dialog().getByRole('button', { name: /^ok$/i }).click();
  }

  async cancel(): Promise<void> {
    await this.dialog().getByRole('button', { name: /^cancel$/i }).click();
  }
}
