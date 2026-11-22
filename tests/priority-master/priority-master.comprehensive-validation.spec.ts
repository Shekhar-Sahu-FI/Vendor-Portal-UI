import { test, expect } from '../../src/fixtures/test.fixture';
import { PRIORITY_MASTER_ROUTES } from '../../src/pages/priority-master/priority-master.constants';

test.describe('Priority Master - Comprehensive Validation Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PRIORITY_MASTER_ROUTES.new());
    await page.waitForLoadState('domcontentloaded');
  });

  // =========================================================================
  // Section 1: Field Controls & Initial State Validations @PRT-UI-FLD
  // =========================================================================
  test.describe('Field Controls & Initial State @PRT-UI-FLD', () => {
    test('PRT-UI-VAL-001: should load form with disabled Code input and default Active status', async ({ page }) => {
      const codeInput = page.locator('input[name="code"], #code').first();
      await expect(codeInput).toBeVisible();
      await expect(codeInput).toBeDisabled();

      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      await expect(statusSelect).toHaveValue('1'); // Status.Active

      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();
      await expect(statusRemarks).toBeDisabled();
    });

    test('PRT-UI-VAL-002: should validate mandatory Priority Name on blur and save', async ({ page }) => {
      const priorityNameInput = page.locator('input[name="priorityName"], #priorityName').first();
      await priorityNameInput.focus();
      await priorityNameInput.blur();

      const errorMsg = page.getByText('Enter Priority Name.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('PRT-UI-VAL-003: should enforce alphanumeric regex mask on Priority Name', async ({ page }) => {
      const priorityNameInput = page.locator('input[name="priorityName"], #priorityName').first();
      await priorityNameInput.fill('Urgent@# 2026!');
      const val = await priorityNameInput.inputValue();
      expect(val).not.toContain('@');
      expect(val).not.toContain('#');
      expect(val).not.toContain('!');
    });

    test('PRT-UI-VAL-004: should enforce Priority Name maximum length boundary of 100 characters', async ({ page }) => {
      const priorityNameInput = page.locator('input[name="priorityName"], #priorityName').first();
      const longName = 'P'.repeat(110);
      await priorityNameInput.fill(longName);
      const val = await priorityNameInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(100);
    });
  });

  // =========================================================================
  // Section 2: Status Toggle & Remarks Validations @PRT-UI-STS
  // =========================================================================
  test.describe('Status & Status Remarks Validations @PRT-UI-STS', () => {
    test('PRT-UI-VAL-005: should enable Status Remarks as mandatory when Status is changed to Inactive', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2'); // Inactive
      await expect(statusRemarks).toBeEnabled();

      await statusRemarks.focus();
      await statusRemarks.blur();

      const errorMsg = page.getByText('Enter Status Remarks.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('PRT-UI-VAL-006: should disable and clear Status Remarks when Status is toggled back to Active', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2');
      await statusRemarks.fill('Inactive priority level');
      expect(await statusRemarks.inputValue()).toBe('Inactive priority level');

      await statusSelect.selectOption('1');
      await expect(statusRemarks).toBeDisabled();
      expect(await statusRemarks.inputValue()).toBe('');
    });

    test('PRT-UI-VAL-007: should enforce Status Remarks max length boundary of 300 characters', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2');
      const longText = 'R'.repeat(350);
      await statusRemarks.fill(longText);
      const val = await statusRemarks.inputValue();
      expect(val.length).toBeLessThanOrEqual(300);
    });
  });

  // =========================================================================
  // Section 3: Save Actions & Business Integrity @PRT-BUS-VAL
  // =========================================================================
  test.describe('Save Actions & Business Integrity @PRT-BUS-VAL', () => {
    test('PRT-BUS-VAL-001: should block form submission when Priority Name is empty', async ({ page }) => {
      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      await expect(page.getByText('Enter Priority Name.').or(page.locator('.text-destructive, .text-red-500')).first()).toBeVisible();
    });

    test('PRT-BUS-VAL-002: should display confirmation alert when valid inputs are submitted', async ({ page }) => {
      const marker = Date.now().toString().slice(-4);
      await page.locator('input[name="priorityName"], #priorityName').first().fill(`Priority_${marker}`);

      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      const dialog = page.locator('.z-alert-box, [role="dialog"], [role="alertdialog"]').first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
    });

    test('PRT-BUS-VAL-003: should display server error message when duplicate Priority Name is submitted', async ({ page }) => {
      await page.route('**/api/**/priority-master*', async (route) => {
        if (route.request().method() === 'POST') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              errors: { PriorityName: ['Duplicate Priority Name not allowed.'] },
            }),
          });
        }
        return route.continue();
      });

      await page.locator('input[name="priorityName"], #priorityName').first().fill('Urgent');
      await page.getByRole('button', { name: /^Save/i }).first().click();

      const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|save/i }).first();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }

      const duplicateError = page.getByText('Duplicate Priority Name not allowed.').or(page.locator('.text-destructive, .text-red-500')).first();
      await expect(duplicateError).toBeVisible({ timeout: 10_000 });
    });

    test('PRT-BUS-VAL-004: should block deletion when Priority is associated with Purchase Requests', async ({ page }) => {
      await page.route('**/api/**/priority-master/*', async (route) => {
        if (route.request().method() === 'DELETE') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              message: 'Cannot delete Priority as it is associated with Purchase Requests.',
            }),
          });
        }
        return route.continue();
      });

      await page.goto(PRIORITY_MASTER_ROUTES.edit(1));
      const deleteBtn = page.getByRole('button', { name: /Delete/i }).first();
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|delete/i }).first();
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
        }
        const errorAlert = page.getByText(/Cannot delete Priority as it is associated/i).or(page.locator('.z-toast, .z-alert-box')).first();
        await expect(errorAlert).toBeVisible({ timeout: 10_000 });
      }
    });
  });
});
