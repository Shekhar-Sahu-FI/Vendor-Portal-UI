import { expect, Locator, Page } from '@playwright/test';
import { RequestForQuotationPrModalRowData } from '../../../types/request-for-quotation.types';
import { DataCellTable } from '../../../utils/data-cell-table';
import { DialogHelper } from '../../../utils/dialog.helper';
import { RFQ_PR_MODAL_GRID_COLUMNS } from '../grids/request-for-quotation-grid.columns';
import { RFQ_PR_MODAL_LABELS } from '../request-for-quotation.constants';

export class RequestForQuotationPrModalSection {
  private readonly table: DataCellTable<typeof RFQ_PR_MODAL_GRID_COLUMNS>;
  private readonly alerts: DialogHelper;

  constructor(private readonly page: Page) {
    this.table = new DataCellTable(page, RFQ_PR_MODAL_GRID_COLUMNS);
    this.alerts = new DialogHelper(page);
  }

  private title(): Locator {
    return this.page
      .locator('h1, h2, h3, h4, h5, h6')
      .filter({ hasText: new RegExp(RFQ_PR_MODAL_LABELS.title, 'i') })
      .last();
  }

  private dialog(): Locator {
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

  async searchByPrNo(prNo: string): Promise<void> {
    const dialog = this.dialog();
    const filterInput = dialog.getByPlaceholder(/filter pr no/i).first();
    const fallback = dialog.getByPlaceholder('Search...').first();
    const target = (await filterInput.count()) ? filterInput : fallback;
    if (!(await target.count())) return;

    await target.fill('');
    await target.fill(prNo);
    await target.press('Enter').catch(() => {});
    await this.page.waitForTimeout(400);
  }

  private checkboxByCellRowId(cellRowId: number): Locator {
    return this.dialog()
      .locator(`[data-cell-id="cell-${cellRowId}-select"]`)
      .locator('input[type="checkbox"]')
      .first();
  }

  private rfqQtyInputByCellRowId(cellRowId: number): Locator {
    return this.dialog()
      .locator(`[data-cell-id="cell-${cellRowId}-rfqQty"]`)
      .locator('input')
      .first();
  }

  async setRowSelection(cellRowId: number, selected: boolean): Promise<void> {
    const checkbox = this.checkboxByCellRowId(cellRowId);
    if (selected) {
      await checkbox.check({ force: true });
    } else {
      await checkbox.uncheck({ force: true });
    }
  }

  private async findCellRowIdByLineNo(lineNo: string | number): Promise<number> {
    const lineNoText = String(lineNo).trim();
    const lineCells = this.dialog().locator('[data-cell-id$="-lineNo"]');
    const count = await lineCells.count();
    for (let i = 0; i < count; i++) {
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
    throw new Error(`RFQ PR modal row not found for Line No "${lineNoText}"`);
  }

  private async resolveCellRowId(row: RequestForQuotationPrModalRowData): Promise<number> {
    if (typeof row.rowIndex === 'number') return row.rowIndex;
    if (row.prNo && row.lineNo !== undefined && row.lineNo !== null) {
      await this.searchByPrNo(row.prNo);
      return this.findCellRowIdByLineNo(row.lineNo);
    }
    throw new Error('Provide either rowIndex or both prNo and lineNo for RFQ PR modal row selection');
  }

  async fillRow(row: RequestForQuotationPrModalRowData): Promise<void> {
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
    if (row.rfqMake) {
      await this.table.selectSuggestion(cellRowId, 'rfqMake', row.rfqMake.query, row.rfqMake.value);
    }
    if (row.rfqUnit) {
      await this.table.selectSuggestion(cellRowId, 'rfqUnit', row.rfqUnit.query, row.rfqUnit.value);
    }
    if (row.rfqQty) {
      const qtyInput = this.rfqQtyInputByCellRowId(cellRowId);
      await qtyInput.click();
      await qtyInput.fill('');
      await qtyInput.type(row.rfqQty, { delay: 40 });
    }
    await this.page.keyboard.press('Tab');
  }

  async fillRows(rows: RequestForQuotationPrModalRowData[] = []): Promise<void> {
    for (const row of rows) {
      await this.fillRow(row);
    }
  }

  private modalOkButton(): Locator {
    return this.dialog().getByRole('button', { name: RFQ_PR_MODAL_LABELS.ok, exact: true });
  }

  /**
   * Confirms PR modal selection and accepts optional RFQ PR warning (rfqPrWarningScope).
   */
  async confirm(): Promise<void> {
    const modal = this.dialog();
    const okBtn = this.modalOkButton();

    await expect(okBtn).toBeVisible({ timeout: 10_000 });
    await expect(okBtn).toBeEnabled();
    await okBtn.click();

    await this.alerts.acceptAlertIfShown({
      subMessage: /do you want to proceed/i,
      timeout: 30_000,
    });

    await expect(modal).toBeHidden({ timeout: 30_000 });
  }

  async cancel(): Promise<void> {
    await this.dialog().getByRole('button', { name: /^cancel$/i }).click();
  }
}
