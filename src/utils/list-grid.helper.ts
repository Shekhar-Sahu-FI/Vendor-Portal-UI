import { expect, Locator, Page } from '@playwright/test';

export type ListRowLookup = {
  /** Visible column header, e.g. "Pur. Req. No." */
  columnHeader?: string;
  /** `data-cell-id` segment, e.g. "displayDocNoYearly" */
  columnId?: string;
  /** Cell text to match, e.g. "SS-PR-0007" or "PR-001" */
  value: string;
  /** When true, cell text must equal `value` (default: includes). */
  exact?: boolean;
};

export type ListGridScope = {
  page: Page;
  /** Defaults to `.search-data-grid` on the page. */
  grid?: Locator;
};

/**
 * Root of generic search / list DataGrid (`.search-data-grid`).
 */
export function listGridRoot(page: Page): Locator {
  return page.locator('.search-data-grid');
}

async function resolveColumnId(grid: Locator, columnHeader: string): Promise<string> {
  const headers = grid.locator('thead th');
  const count = await headers.count();
  for (let i = 0; i < count; i++) {
    const text = ((await headers.nth(i).innerText()) ?? '').replace(/\s+/g, ' ').trim();
    if (text === columnHeader || text.includes(columnHeader)) {
      const cell = grid.locator('tbody tr').first().locator('td').nth(i);
      const cellId = await cell.getAttribute('data-cell-id');
      const match = cellId?.match(/^cell-\d+-(.+)$/);
      if (match) return match[1];
    }
  }
  throw new Error(`List grid column not found for header "${columnHeader}"`);
}

function cellMatches(value: string, cellText: string, exact?: boolean): boolean {
  const normalized = cellText.replace(/\s+/g, ' ').trim();
  return exact ? normalized === value : normalized.includes(value);
}

async function readCellText(cell: Locator): Promise<string> {
  const title = await cell.getAttribute('title');
  if (title?.trim()) return title.trim();
  return ((await cell.innerText()) ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * Row index (`cell-{n}-*`) for the first row whose column cell matches `value`.
 */
export async function findListRowIndex(
  grid: Locator,
  lookup: ListRowLookup,
): Promise<number> {
  const columnId =
    lookup.columnId
    ?? (lookup.columnHeader ? await resolveColumnId(grid, lookup.columnHeader) : undefined);

  if (!columnId) {
    throw new Error('Provide columnHeader or columnId to find a list row');
  }

  const cells = grid.locator(`[data-cell-id$="-${columnId}"]`);
  const count = await cells.count();

  for (let i = 0; i < count; i++) {
    const cell = cells.nth(i);
    const text = await readCellText(cell);
    if (!cellMatches(lookup.value, text, lookup.exact)) continue;

    const cellId = await cell.getAttribute('data-cell-id');
    const match = cellId?.match(/^cell-(\d+)-/);
    if (match) return Number(match[1]);
  }

  throw new Error(
    `No list row where column "${columnId}" matches "${lookup.value}"`,
  );
}

/**
 * `#` action column button (view / open — LuFileSymlink or LuPencil in the app).
 */
export function listRowActionButton(grid: Locator, rowIndex: number): Locator {
  return grid
    .locator(`[data-cell-id="cell-${rowIndex}-actions"]`)
    .getByRole('button')
    .first();
}

/**
 * Locator for the row action button for a document (or any column value).
 */
export async function getListRowActionButton(
  scope: ListGridScope,
  lookup: ListRowLookup,
): Promise<Locator> {
  const grid = scope.grid ?? listGridRoot(scope.page);
  await expect(grid).toBeVisible({ timeout: 30_000 });
  const rowIndex = await findListRowIndex(grid, lookup);
  return listRowActionButton(grid, rowIndex);
}

/**
 * Clicks the list row action button (# column) for the matching record.
 */
export async function openListRowByColumnValue(
  scope: ListGridScope,
  lookup: ListRowLookup,
): Promise<number> {
  const grid = scope.grid ?? listGridRoot(scope.page);
  const rowIndex = await findListRowIndex(grid, lookup);
  const action = listRowActionButton(grid, rowIndex);

  await expect(action).toBeVisible({ timeout: 10_000 });
  await expect(action).toBeEnabled();
  await action.click();

  return rowIndex;
}
