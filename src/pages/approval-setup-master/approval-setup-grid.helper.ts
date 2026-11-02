import { Locator, Page, expect } from '@playwright/test';

/**
 * Locates a form card section by its header title (e.g. "Company Detail").
 */
export function approvalSetupSection(page: Page, sectionTitle: string): Locator {
  return page.locator('div').filter({
    has: page.getByText(sectionTitle, { exact: true }),
  }).first();
}

/**
 * Checks the selection checkbox for a grid row inside a section card.
 */
export async function selectSectionGridRow(scope: Locator, rowIndex: number): Promise<void> {
  const checkbox = scope
    .locator(`[data-cell-id="cell-${rowIndex}-select"] input[type="checkbox"]`)
    .first();
  await expect(checkbox).toBeVisible({ timeout: 15_000 });
  await checkbox.check();
}

/**
 * Selects grid rows whose text matches any of the given values.
 */
export async function selectSectionGridRowsByText(
  scope: Locator,
  values: string[],
): Promise<void> {
  for (const value of values) {
    const row = scope.locator('tbody tr').filter({ hasText: value }).first();
    await expect(row).toBeVisible({ timeout: 15_000 });
    const checkbox = row.locator('[data-cell-id$="-select"] input[type="checkbox"]').first();
    await checkbox.check();
  }
}

/**
 * Selects a dropdown option inside an inline grid cell.
 */
export async function selectDropdownInCell(cell: Locator, optionLabel: string): Promise<void> {
  await cell.click();
  const select = cell.locator('select').first();
  if (await select.isVisible().catch(() => false)) {
    await select.selectOption({ label: optionLabel });
    return;
  }
  const option = cell.page().getByRole('option', { name: optionLabel }).first();
  if (await option.isVisible().catch(() => false)) {
    await option.click();
    return;
  }
  await cell.page().getByText(optionLabel, { exact: true }).first().click();
}

/**
 * Locates the Manage Users dialog opened from a level row.
 */
export function manageUsersModal(page: Page): Locator {
  return page.locator('div').filter({
    has: page.getByText(/Manage Users for Level/i),
  }).first();
}
