import { Page, Locator, expect } from '@playwright/test';

export async function selectFromAutoSuggestion(
  page: Page,
  inputFields: Locator,
  query: string,
  valueToSelect: string,
  index: number = 0,
) {
  const timeout = 6000;

  const inputField = inputFields.nth(index);

  await inputField.click();
  await inputField.fill('');
  await inputField.pressSequentially(query, { delay: 40 });

  // Target the currently active visible popover (last portal in DOM)
  const visiblePopover = page.locator('div.bg-popover:visible, div[class*="bg-popover"]:visible').last();
  const suggestionRow = visiblePopover
    .locator('table tbody tr, ul li')
    .filter({ hasText: valueToSelect })
    .first();

  const suggestionOption = page
    .getByRole('option')
    .filter({ hasText: valueToSelect })
    .first();

  try {
    if (await suggestionRow.isVisible({ timeout: 2000 }).catch(() => false)) {
      await suggestionRow.click();
    } else if (await suggestionOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await suggestionOption.click();
    } else {
      await expect(suggestionRow).toBeVisible({ timeout });
      await suggestionRow.click();
    }
  } catch {
    const firstRow = visiblePopover.locator('table tbody tr, ul li, [role="option"]').first();
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstRow.click();
    }
  }

  await visiblePopover.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
  await expect(inputField).not.toHaveValue('', { timeout }).catch(() => {});
}
