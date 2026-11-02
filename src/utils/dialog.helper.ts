import { Page, expect } from '@playwright/test';
import { fillTextField } from './field-accessor';

/**
 * Handles ERP confirmation and info dialogs rendered by UCAlertRenderer.
 * Confirm/cancel buttons use "Ok" and "Cancel" (not Yes/No).
 */
export class DialogHelper {
  constructor(private readonly page: Page) {}

  private dialogRoot() {
    return this.page.locator('.z-alert-box').last();
  }

  private confirmButton(dialog: ReturnType<DialogHelper['dialogRoot']>) {
    return dialog.getByRole('button', { name: /^Ok$/i });
  }

  private cancelButton(dialog: ReturnType<DialogHelper['dialogRoot']>) {
    return dialog.getByRole('button', { name: /^Cancel$/i });
  }

  async confirmSave(message = 'Do you want to save?') {
    await this.confirmDialog('Confirmation', message);
  }

  async confirmDelete(message = 'Do you want to delete?') {
    await this.confirmDialog('Confirmation', message);
  }

  async confirmDialog(title: string, message?: string) {
    const dialog = this.dialogRoot();
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog.getByRole('heading', { name: title, exact: true })).toBeVisible();
    if (message) {
      await expect(dialog.getByText(message, { exact: true })).toBeVisible();
    }
    await this.confirmButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
  }

  /**
   * Delete flow when portal requires a delete reason (textarea in dialog).
   */
  async confirmDeleteWithReason(reason: string) {
    const dialog = this.dialogRoot();
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog.getByRole('heading', { name: 'Delete Confirmation' })).toBeVisible();
    await fillTextField(this.page, 'Reason', reason);
    const deleteBtn = dialog.getByRole('button', { name: /^Delete$/i });
    await deleteBtn.click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
  }

  /**
   * Clicks Ok on the topmost UCAlertRenderer dialog when it appears (e.g. RFQ PR warning).
   */
  async acceptAlertIfShown(
    options?: { subMessage?: RegExp | string; timeout?: number },
  ): Promise<boolean> {
    const timeout = options?.timeout ?? 20_000;
    const dialog = this.dialogRoot();
    const shown = await dialog.waitFor({ state: 'visible', timeout }).then(() => true).catch(() => false);
    if (!shown) return false;

    if (options?.subMessage) {
      const msg = dialog.getByText(options.subMessage);
      await expect(msg.first()).toBeVisible({ timeout: 5_000 });
    }

    await this.confirmButton(dialog).click();
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    return true;
  }

  async dismissDialog() {
    const dialog = this.dialogRoot();
    if (await dialog.isVisible().catch(() => false)) {
      await this.cancelButton(dialog).click();
      await expect(dialog).toBeHidden({ timeout: 15_000 });
    }
  }

  async expectSuccessToast(message?: string | RegExp) {
    const toast = this.page.getByText(message ?? /successfully/i);
    await expect(toast.first()).toBeVisible({ timeout: 30_000 });
  }
}
