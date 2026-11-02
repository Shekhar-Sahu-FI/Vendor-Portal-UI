import { expect, Page } from '@playwright/test';
import { getFieldContainer } from '../field-accessor';
import type { ValidationExpectation } from './types';

export async function expectSaveNotConfirmed(page: Page): Promise<void> {
  const dialog = page.locator('.z-alert-box').last();
  await expect(dialog.getByRole('heading', { name: 'Confirmation', exact: true })).toHaveCount(0);
}

export async function expectValidationMessage(page: Page, message: string | RegExp): Promise<void> {
  await expect(page.getByText(message).first()).toBeVisible({ timeout: 15_000 });
}

export async function expectFieldValidation(
  page: Page,
  fieldLabel: string,
  message: string | RegExp,
): Promise<void> {
  const error = getFieldContainer(page, fieldLabel).locator('.text-destructive').filter({ hasText: message });
  await expect(error.first()).toBeVisible({ timeout: 15_000 });
}

export async function expectGridSummaryValidation(
  page: Page,
  message: string | RegExp,
): Promise<void> {
  const summary = page.locator('.text-red-500').filter({ hasText: message });
  await expect(summary.first()).toBeVisible({ timeout: 15_000 });
}

export async function expectGridCellValidation(
  page: Page,
  rowIndex: number,
  columnId: string,
  message: string | RegExp,
): Promise<void> {
  const cell = page.locator(`[data-cell-id="cell-${rowIndex}-${columnId}"]`);
  await cell.scrollIntoViewIfNeeded();
  await cell.hover();
  await expect(
    page.locator('[data-radix-popper-content-wrapper]').last().getByText(message).first(),
  ).toBeVisible({ timeout: 10_000 });
  await page.keyboard.press('Escape');
}

export async function assertValidationExpectations(
  page: Page,
  expectConfig: ValidationExpectation,
): Promise<void> {
  for (const message of expectConfig.messages ?? []) {
    await expectValidationMessage(page, message);
  }
  for (const field of expectConfig.fields ?? []) {
    await expectFieldValidation(page, field.label, field.message);
  }
  for (const message of expectConfig.gridSummary ?? []) {
    await expectGridSummaryValidation(page, message);
  }
  for (const cell of expectConfig.gridCells ?? []) {
    await expectGridCellValidation(page, cell.row, cell.columnId, cell.message);
  }
}
