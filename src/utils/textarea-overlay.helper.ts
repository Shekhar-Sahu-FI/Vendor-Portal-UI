import { Page, expect } from '@playwright/test';

/**
 * Grid textarea cells that open `.uc-overlaypanel` with a multiline editor.
 */
export class TextAreaOverlayHelper {
  constructor(private readonly page: Page) {}

  overlay() {
    return this.page.locator('.uc-overlaypanel').last();
  }

  textarea(placeholder: string) {
    return this.overlay().getByPlaceholder(placeholder);
  }

  textareaWithoutPlaceholder() {
    return this.overlay().locator('textarea').first();
  }

  async waitForVisible(placeholder?: string): Promise<void> {
    await expect(this.overlay()).toBeVisible({ timeout: 10_000 });
    if (placeholder) {
      const withPlaceholder = this.textarea(placeholder);
      if (await withPlaceholder.count()) {
        await expect(withPlaceholder).toBeVisible({ timeout: 10_000 });
        return;
      }
    }
    await expect(this.textareaWithoutPlaceholder()).toBeVisible({ timeout: 10_000 });
  }

  async enterTextAndSave(value: string, placeholder?: string): Promise<void> {
    let target = this.textareaWithoutPlaceholder();
    if (placeholder) {
      const withPlaceholder = this.textarea(placeholder);
      if (await withPlaceholder.count()) {
        target = withPlaceholder;
      }
    }
    await target.fill(value);
    const saveBtn = this.overlay().locator('button[type="submit"], button[aria-label="Save"]').first();
    if (await saveBtn.isVisible().catch(() => false)) {
      await saveBtn.click();
    } else {
      await this.overlay().locator('.flex.justify-end button').last().click();
    }
    await expect(this.overlay()).toBeHidden({ timeout: 10_000 });
  }
}
