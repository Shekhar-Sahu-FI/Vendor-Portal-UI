import { Locator, Page, expect } from '@playwright/test';
import {
  ListRowLookup,
  getListRowActionButton,
  listGridRoot,
  openListRowByColumnValue,
} from './list-grid.helper';

export type { ListRowLookup } from './list-grid.helper';
export {
  findListRowIndex,
  getListRowActionButton,
  listGridRoot,
  listRowActionButton,
  openListRowByColumnValue,
} from './list-grid.helper';
export { columnFilterPlaceholder } from './save-response.helper';

/**
 * Reusable interactions for the generic search DataGrid (.search-data-grid).
 */
export class GridHelper {
  constructor(private readonly page: Page) {}

  gridRoot(): Locator {
    return listGridRoot(this.page);
  }

  async waitForLoaded() {
    await expect(this.gridRoot()).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Action button (# column) for a row identified by a column value (e.g. doc number).
   */
  async getRowActionButton(lookup: ListRowLookup): Promise<Locator> {
    await this.waitForLoaded();
    return getListRowActionButton({ page: this.page, grid: this.gridRoot() }, lookup);
  }

  /**
   * Opens view/display (or edit when no display page) via the # action button on the matching row.
   */
  async openRowByColumnValue(lookup: ListRowLookup): Promise<void> {
    await this.waitForLoaded();
    await openListRowByColumnValue({ page: this.page, grid: this.gridRoot() }, lookup);
  }

  async openRowByDocNo(docNo: string, columnHeader: string): Promise<void> {
    await this.openRowByColumnValue({ columnHeader, value: docNo });
  }

  async openFirstRow() {
    await this.waitForLoaded();
    const grid = this.gridRoot();
    const action = grid.locator('[data-cell-id="cell-0-actions"]').getByRole('button').first();
    if (await action.isVisible().catch(() => false)) {
      await action.click();
      return;
    }
    const firstRow = grid.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    await firstRow.click();
  }

  /** Finds any row containing `text` and clicks its # action button. */
  async openRowByText(text: string) {
    await this.waitForLoaded();
    const row = this.gridRoot().locator('tbody tr').filter({ hasText: text }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    const action = row.locator('[data-cell-id$="-actions"]').getByRole('button').first();
    if (await action.isVisible().catch(() => false)) {
      await action.click();
    } else {
      await row.click();
    }
  }

  async searchGlobal(query: string) {
    const searchInput = this.gridRoot().getByPlaceholder('Search...');
    await searchInput.fill(query);
    await searchInput.press('Enter');
    await this.waitForLoaded();
  }

  /**
   * Types into a column filter (e.g. `Filter Pur. Req. No....`) and waits for grid reload.
   */
  async filterByColumnPlaceholder(
    placeholder: string,
    value: string,
    options?: { listUrlPattern?: RegExp },
  ): Promise<void> {
    await this.waitForLoaded();
    const filter = this.gridRoot().getByPlaceholder(placeholder, { exact: true });
    await expect(filter).toBeVisible({ timeout: 15_000 });

    const listPattern = options?.listUrlPattern ?? /purchase-request|purchase-order|request-for-quotation/i;
    const reload = this.page
      .waitForResponse(
        (response) =>
          listPattern.test(response.url())
          && response.request().method() === 'GET'
          && response.ok(),
        { timeout: 30_000 },
      )
      .catch(() => null);

    await filter.fill('');
    await filter.fill(value);
    await reload;
    await expect(this.gridRoot().locator('tbody tr').first()).toBeVisible({ timeout: 30_000 });
  }

  /**
   * Filter by column placeholder, then open the first row via the # action button.
   */
  async filterAndOpenFirstRow(filterPlaceholder: string, value: string): Promise<void> {
    await this.filterByColumnPlaceholder(filterPlaceholder, value);
    await this.openFirstRow();
  }

  /**
   * Edits an inline grid cell by column header text (e.g. Item Name, Required Qty.).
   */
  async editGridCell(columnHeader: string, value: string, rowIndex = 0) {
    const grid = this.page.locator('.form-content').locator('table').first();
    await expect(grid).toBeVisible();

    const headerCells = grid.locator('thead th');
    const headerCount = await headerCells.count();
    let colIndex = -1;
    for (let i = 0; i < headerCount; i++) {
      const text = await headerCells.nth(i).innerText();
      if (text.includes(columnHeader)) {
        colIndex = i;
        break;
      }
    }
    if (colIndex < 0) {
      throw new Error(`Column "${columnHeader}" not found in item grid`);
    }

    const cell = grid.locator('tbody tr').nth(rowIndex).locator('td').nth(colIndex);
    await cell.click();
    const editor = cell.locator('input, textarea').first();
    if (await editor.isVisible().catch(() => false)) {
      await editor.fill(value);
      await editor.press('Tab');
    } else {
      await this.page.keyboard.type(value);
      await this.page.keyboard.press('Tab');
    }
  }

  /**
   * Selects item via Item Name auto-suggestion in the first grid row.
   */
  async selectItemInFirstRow(itemName: string) {
    const grid = this.page.locator('.form-content table').first();
    const itemHeader = grid.locator('thead th').filter({ hasText: 'Item Name' });
    const colIndex = await itemHeader.evaluate((el) => {
      const th = el as HTMLTableCellElement;
      return Array.from(th.parentElement?.children ?? []).indexOf(th);
    });

    const cell = grid.locator('tbody tr').first().locator('td').nth(colIndex);
    await cell.click();
    const input = cell.locator('input').first();
    await input.fill(itemName);
    const match = this.page.getByRole('row').filter({ hasText: itemName }).first();
    await expect(match.or(this.page.locator('[role="listbox"] [role="option"]').first())).toBeVisible({ timeout: 15_000 });
    if (await match.isVisible().catch(() => false)) {
      await match.click();
    } else {
      await this.page.locator('[role="listbox"] [role="option"], .suggestion-row').first().click();
    }
  }
}
