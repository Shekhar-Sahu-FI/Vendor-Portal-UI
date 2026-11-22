import { Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * Shared toolbar actions from form-layout.tsx (Save, Delete, Add New, Cancel).
 */
export class FormLayoutPage extends BasePage {
  constructor(page: Page, path: string) {
    super(page, path);
  }

  saveButton() {
    return this.page.getByRole('button', { name: /^Save( Changes)?$/i }).first();
  }

  cancelButton() {
    return this.page.getByRole('button', { name: 'Cancel' }).first();
  }

  addNewButton() {
    return this.page.getByRole('button', { name: 'Add New' }).first();
  }

  private confirmationAlert() {
    return this.page.locator('.z-alert-box').last();
  }

  /**
   * Closes open popovers/calendars so the toolbar Save button is clickable.
   */
  async closeTransientUi() {
    await this.page.keyboard.press('Escape');
    await this.page
      .locator('div:has(.grid.grid-cols-7)')
      .waitFor({ state: 'hidden', timeout: 2_000 })
      .catch(() => {});
    const alertBtn = this.page.locator('.z-alert-box button').first();
    if (await alertBtn.isVisible().catch(() => false)) {
      await alertBtn.click().catch(() => {});
    }
  }

  async clickSave() {
    console.log('[clickSave] closing transient UI...');
    await this.closeTransientUi();
    const save = this.saveButton();
    console.log('[clickSave] waiting for save button...');
    await save.scrollIntoViewIfNeeded();
    await expect(save).toBeVisible({ timeout: 30_000 });
    await expect(save).toBeEnabled({ timeout: 30_000 });
    console.log('[clickSave] clicking save button...');
    await save.click({ force: true });
    console.log('[clickSave] clicked save button');
  }

  /**
   * Confirms save via the in-page alert (Ok button). Does not use DialogHelper.
   */
  async acceptSaveConfirmation() {
    console.log('[acceptSaveConfirmation] waiting for alert dialog...');
    const dialog = this.confirmationAlert();
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    console.log('[acceptSaveConfirmation] alert dialog visible!');

    const title = ((await dialog.getByRole('heading').textContent()) ?? '').trim();
    console.log(`[acceptSaveConfirmation] alert dialog title="${title}"`);
    if (title !== 'Confirmation') {
      const message = ((await dialog.textContent()) ?? '').replace(/\s+/g, ' ').trim();
      throw new Error(`Save blocked by "${title}" dialog: ${message.slice(0, 300)}`);
    }

    const okButton = dialog.getByRole('button', { name: /^Ok$/i });
    await expect(okButton).toBeVisible();
    console.log('[acceptSaveConfirmation] clicking OK...');
    await okButton.click();
    console.log('[acceptSaveConfirmation] clicked OK, waiting for hidden...');
    await expect(dialog).toBeHidden({ timeout: 15_000 });
    console.log('[acceptSaveConfirmation] dialog hidden!');
  }

  async clickSaveAndConfirm() {
    const saveRequest = this.page.waitForResponse(
      (response) =>
        /purchase-order|purchase-request|request-for-quotation/i.test(response.url())
        && ['POST', 'PUT'].includes(response.request().method())
        && response.ok(),
      { timeout: 90_000 },
    );

    await this.clickSave();
    await this.acceptSaveConfirmation();
    await saveRequest;

    // If DocSavedAlert dialog appears (title contains "Saved"), click OK
    const docSavedDialog = this.page.locator('.z-alert-box').filter({ hasText: /Saved/i });
    if (await docSavedDialog.isVisible({ timeout: 5000 }).catch(() => false)) {
      const okButton = docSavedDialog.getByRole('button', { name: /^OK$/i });
      await okButton.click().catch(() => {});
      await docSavedDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    }
  }

  private formToolbar() {
    return this.page.locator('.form-page-header, .flex.gap-2').filter({
      has: this.page.getByRole('button', { name: /^Save/ }),
    });
  }

  async openActionsMenu() {
    await this.formToolbar().locator('button').last().click();
  }

  async clickDeleteFromMenu() {
    await this.openActionsMenu();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
    await this.dialog.confirmDelete();
  }

  async expectSuccessAfterSave(message?: string | RegExp) {
    const pattern = message ?? /successfully|saved/i;
    const toast = this.page.locator('.z-toast').filter({ hasText: pattern });
    await expect(toast.first()).toBeVisible({ timeout: 30_000 });
  }
}
