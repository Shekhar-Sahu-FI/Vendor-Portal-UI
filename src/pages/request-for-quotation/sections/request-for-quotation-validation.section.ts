import { expect, Page } from '@playwright/test';
import { getFieldContainer } from '../../../utils/field-accessor';

/**
 * Asserts RFQ form validation messages shown by the validation engine.
 */
export class RequestForQuotationValidationSection {
  constructor(private readonly page: Page) {}

  private confirmationDialog() {
    return this.page.locator('.z-alert-box').last();
  }

  async expectOnNewForm(): Promise<void> {
    await expect(this.page).toHaveURL(/\/request-for-quotation\/new/);
  }

  async expectSaveConfirmationNotShown(): Promise<void> {
    const dialog = this.confirmationDialog();
    await expect(dialog.getByRole('heading', { name: 'Confirmation', exact: true })).toHaveCount(0);
  }

  /**
   * Message may appear under a field (.text-destructive) or below a grid (.text-red-500).
   */
  async expectMessage(message: string | RegExp): Promise<void> {
    const locator =
      typeof message === 'string'
        ? this.page.getByText(message, { exact: true })
        : this.page.getByText(message);
    await expect(locator.first()).toBeVisible({ timeout: 15_000 });
  }

  async expectMessages(messages: Array<string | RegExp>): Promise<void> {
    for (const message of messages) {
      await this.expectMessage(message);
    }
  }

  async expectFieldMessage(fieldLabel: string, message: string | RegExp): Promise<void> {
    const container = getFieldContainer(this.page, fieldLabel);
    const error = container.locator('.text-destructive').filter({ hasText: message });
    await expect(error.first()).toBeVisible({ timeout: 15_000 });
  }

  async expectGridSummaryMessage(message: string | RegExp): Promise<void> {
    const summary = this.page.locator('.text-red-500.text-sm').filter({ hasText: message });
    await expect(summary.first()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Row-level grid errors render in a popover on the cell corner (ValidationWrapper).
   */
  async expectGridCellMessage(
    rowIndex: number,
    columnId: string,
    message: string | RegExp,
  ): Promise<void> {
    const cell = this.page.locator(`[data-cell-id="cell-${rowIndex}-${columnId}"]`);
    await cell.scrollIntoViewIfNeeded();
    await cell.hover();
    const popover = this.page.locator('[data-radix-popper-content-wrapper]').last();
    await expect(popover.getByText(message).first()).toBeVisible({ timeout: 10_000 });
    await this.page.keyboard.press('Escape');
  }
}
