import { Locator, Page } from '@playwright/test';

/**
 * Locates a form card section by its header title (e.g. "Make Detail").
 */
export function itemMasterSection(page: Page, sectionTitle: string): Locator {
  return page.locator('div').filter({
    has: page.getByText(sectionTitle, { exact: true }),
  }).first();
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
