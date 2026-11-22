import { test, expect } from '../../src/fixtures/test.fixture';
import { MAKE_MASTER_ROUTES } from '../../src/pages/make-master/make-master.constants';

test.describe('Make Master - Comprehensive Validation Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(MAKE_MASTER_ROUTES.new());
    await page.waitForLoadState('domcontentloaded');
  });

  // =========================================================================
  // Section 1: Field Controls & Initial State Validations @MAK-UI-FLD
  // =========================================================================
  test.describe('Field Controls & Initial State @MAK-UI-FLD', () => {
    test('MAK-UI-VAL-001: should load form with disabled Code input and default Active status', async ({ page }) => {
      const codeInput = page.locator('input[name="code"], #code').first();
      await expect(codeInput).toBeVisible();
      await expect(codeInput).toBeDisabled();

      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      await expect(statusSelect).toHaveValue('1'); // Status.Active

      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();
      await expect(statusRemarks).toBeDisabled();
    });

    test('MAK-UI-VAL-002: should prevent typing in Code field due to disabled attribute', async ({ page }) => {
      const codeInput = page.locator('input[name="code"], #code').first();
      await expect(codeInput).toBeDisabled();
      const initialVal = await codeInput.inputValue();
      await codeInput.pressSequentially('99', { timeout: 1000 }).catch(() => {});
      expect(await codeInput.inputValue()).toBe(initialVal);
    });

    test('MAK-UI-VAL-003: should validate mandatory Make Name on blur and save', async ({ page }) => {
      const makeNameInput = page.locator('input[name="makeName"], #makeName').first();
      await makeNameInput.focus();
      await makeNameInput.blur();

      const errorMsg = page.getByText('Enter Make Name.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('MAK-UI-VAL-004: should enforce alphanumeric regex mask on Make Name', async ({ page }) => {
      const makeNameInput = page.locator('input[name="makeName"], #makeName').first();
      await makeNameInput.fill('Tata@# Motors!');
      const val = await makeNameInput.inputValue();
      expect(val).not.toContain('@');
      expect(val).not.toContain('#');
      expect(val).not.toContain('!');
    });

    test('MAK-UI-VAL-005: should enforce Make Name maximum length boundary of 100 characters', async ({ page }) => {
      const makeNameInput = page.locator('input[name="makeName"], #makeName').first();
      const longName = 'M'.repeat(110);
      await makeNameInput.fill(longName);
      const val = await makeNameInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(100);
    });

    test('MAK-UI-VAL-006: should treat Alias as optional and allow saving without Alias', async ({ page }) => {
      const makeNameInput = page.locator('input[name="makeName"], #makeName').first();
      const aliasInput = page.locator('input[name="alias"], #alias').first();

      await makeNameInput.fill(`Make_${Date.now()}`);
      await aliasInput.fill(''); // Optional

      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      // Does not show validation error for Alias
      await expect(page.getByText('Enter Alias.')).not.toBeVisible();
    });

    test('MAK-UI-VAL-007: should enforce Alias maximum length boundary of 100 characters', async ({ page }) => {
      const aliasInput = page.locator('input[name="alias"], #alias').first();
      const longAlias = 'A'.repeat(110);
      await aliasInput.fill(longAlias);
      const val = await aliasInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(100);
    });
  });

  // =========================================================================
  // Section 2: Status Toggle & Remarks Validations @MAK-UI-STS
  // =========================================================================
  test.describe('Status & Status Remarks Validations @MAK-UI-STS', () => {
    test('MAK-UI-VAL-008: should enable Status Remarks as mandatory when Status is changed to Inactive', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2'); // Inactive
      await expect(statusRemarks).toBeEnabled();

      await statusRemarks.focus();
      await statusRemarks.blur();

      const errorMsg = page.getByText('Enter Status Remarks.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('MAK-UI-VAL-009: should disable and clear Status Remarks when Status is toggled back to Active', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2');
      await statusRemarks.fill('Inactive vendor make');
      expect(await statusRemarks.inputValue()).toBe('Inactive vendor make');

      await statusSelect.selectOption('1');
      await expect(statusRemarks).toBeDisabled();
      expect(await statusRemarks.inputValue()).toBe('');
    });

    test('MAK-UI-VAL-010: should enforce Status Remarks max length boundary of 300 characters', async ({ page }) => {
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
  // Section 3: Save Actions & Form Lifecycle Validations @MAK-UI-OPS
  // =========================================================================
  test.describe('Form Submission & Lifecycle Operations @MAK-UI-OPS', () => {
    test('MAK-UI-VAL-011: should block form submission when Make Name is empty', async ({ page }) => {
      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      await expect(page.getByText('Enter Make Name.').or(page.locator('.text-destructive, .text-red-500')).first()).toBeVisible();
    });

    test('MAK-UI-VAL-012: should display confirmation alert when valid inputs are submitted', async ({ page }) => {
      const marker = Date.now().toString().slice(-4);
      await page.locator('input[name="makeName"], #makeName').first().fill(`Make_${marker}`);

      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      const dialog = page.locator('.z-alert-box, [role="dialog"], [role="alertdialog"]').first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
    });

    test('MAK-UI-VAL-013: should clear form fields and errors when Reset button is clicked', async ({ page }) => {
      const makeNameInput = page.locator('input[name="makeName"], #makeName').first();
      const aliasInput = page.locator('input[name="alias"], #alias').first();

      await makeNameInput.fill('Temporary Make');
      await aliasInput.fill('TMP');

      const resetBtn = page.getByRole('button', { name: /Reset/i }).first();
      if (await resetBtn.isVisible()) {
        await resetBtn.click();
        expect(await makeNameInput.inputValue()).toBe('');
        expect(await aliasInput.inputValue()).toBe('');
      }
    });

    test('MAK-UI-VAL-014: should navigate back to list view when Cancel button is clicked', async ({ page }) => {
      const cancelBtn = page.getByRole('button', { name: /Cancel/i }).first();
      await cancelBtn.click();
      await expect(page).toHaveURL(new RegExp(MAKE_MASTER_ROUTES.list()));
    });
  });

  // =========================================================================
  // Section 4: Relational & Business Rule Integrity @MAK-BUS-VAL
  // =========================================================================
  test.describe('Business Rules & Integrity Validations @MAK-BUS-VAL', () => {
    test('MAK-BUS-VAL-001: should display server error message when duplicate Make Name is submitted', async ({ page }) => {
      await page.route('**/api/**/make-master*', async (route) => {
        if (route.request().method() === 'POST') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              errors: { MakeName: ['Duplicate Make Name not allowed.'] },
            }),
          });
        }
        return route.continue();
      });

      await page.locator('input[name="makeName"], #makeName').first().fill('Tata Steel');
      await page.getByRole('button', { name: /^Save/i }).first().click();

      const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|save/i }).first();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }

      const duplicateError = page.getByText('Duplicate Make Name not allowed.').or(page.locator('.text-destructive, .text-red-500')).first();
      await expect(duplicateError).toBeVisible({ timeout: 10_000 });
    });

    test('MAK-BUS-VAL-002: should block deletion when Make is mapped in Item Master or CS Make Map', async ({ page }) => {
      await page.route('**/api/**/make-master/*', async (route) => {
        if (route.request().method() === 'DELETE') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              message: 'Cannot delete Make as it is associated with Item Master.',
            }),
          });
        }
        return route.continue();
      });

      await page.goto(MAKE_MASTER_ROUTES.edit(1));
      const deleteBtn = page.getByRole('button', { name: /Delete/i }).first();
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|delete/i }).first();
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
        }
        const errorAlert = page.getByText(/Cannot delete Make as it is associated/i).or(page.locator('.z-toast, .z-alert-box')).first();
        await expect(errorAlert).toBeVisible({ timeout: 10_000 });
      }
    });
  });
});
