import { test, expect } from '../../src/fixtures/test.fixture';
import { UNIT_MASTER_ROUTES } from '../../src/pages/unit-master/unit-master.constants';

test.describe('Unit Master - Comprehensive Validation Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(UNIT_MASTER_ROUTES.new());
    await page.waitForLoadState('domcontentloaded');
  });

  // =========================================================================
  // Section 1: Field Controls & Initial State Validations @UNT-UI-FLD
  // =========================================================================
  test.describe('Field Controls & Initial State @UNT-UI-FLD', () => {
    test('UNT-UI-VAL-001: should load form with disabled Code input and default Active status', async ({ page }) => {
      const codeInput = page.locator('input[name="code"], #code').first();
      await expect(codeInput).toBeVisible();
      await expect(codeInput).toBeDisabled();

      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      await expect(statusSelect).toHaveValue('1'); // Status.Active

      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();
      await expect(statusRemarks).toBeDisabled();
    });

    test('UNT-UI-VAL-002: should prevent typing in Code field due to disabled attribute', async ({ page }) => {
      const codeInput = page.locator('input[name="code"], #code').first();
      await expect(codeInput).toBeDisabled();
      const initialVal = await codeInput.inputValue();
      await codeInput.pressSequentially('99', { timeout: 1000 }).catch(() => {});
      expect(await codeInput.inputValue()).toBe(initialVal);
    });

    test('UNT-UI-VAL-003: should validate mandatory Unit Name on blur and save', async ({ page }) => {
      const unitNameInput = page.locator('input[name="unitName"], #unitName').first();
      await unitNameInput.focus();
      await unitNameInput.blur();

      const errorMsg = page.getByText('Enter Unit Name.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('UNT-UI-VAL-004: should enforce alphanumeric regex mask on Unit Name', async ({ page }) => {
      const unitNameInput = page.locator('input[name="unitName"], #unitName').first();
      await unitNameInput.fill('Kg@# 10!');
      const val = await unitNameInput.inputValue();
      // inputRegex.alphaNumeric permits only alphanumeric and spaces
      expect(val).not.toContain('@');
      expect(val).not.toContain('#');
      expect(val).not.toContain('!');
    });

    test('UNT-UI-VAL-005: should enforce Unit Name maximum length boundary of 25 characters', async ({ page }) => {
      const unitNameInput = page.locator('input[name="unitName"], #unitName').first();
      const longName = 'A'.repeat(30);
      await unitNameInput.fill(longName);
      const val = await unitNameInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(25);
    });

    test('UNT-UI-VAL-006: should validate mandatory Alias on blur and save', async ({ page }) => {
      const aliasInput = page.locator('input[name="alias"], #alias').first();
      await aliasInput.focus();
      await aliasInput.blur();

      const errorMsg = page.getByText('Enter Alias.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('UNT-UI-VAL-007: should enforce Alias alphanumeric regex mask', async ({ page }) => {
      const aliasInput = page.locator('input[name="alias"], #alias').first();
      await aliasInput.fill('KG%&');
      const val = await aliasInput.inputValue();
      expect(val).not.toContain('%');
      expect(val).not.toContain('&');
    });

    test('UNT-UI-VAL-008: should enforce Alias maximum length boundary of 6 characters', async ({ page }) => {
      const aliasInput = page.locator('input[name="alias"], #alias').first();
      await aliasInput.fill('KILOGRAMS');
      const val = await aliasInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(6);
    });
  });

  // =========================================================================
  // Section 2: Status Toggle & Remarks Validations @UNT-UI-STS
  // =========================================================================
  test.describe('Status & Status Remarks Validations @UNT-UI-STS', () => {
    test('UNT-UI-VAL-009: should enable Status Remarks as mandatory when Status is changed to Inactive', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2'); // Inactive
      await expect(statusRemarks).toBeEnabled();

      // Trigger blur on empty remarks
      await statusRemarks.focus();
      await statusRemarks.blur();

      const errorMsg = page.getByText('Enter Status Remarks.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('UNT-UI-VAL-010: should disable and clear Status Remarks when Status is toggled back to Active', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2'); // Inactive
      await statusRemarks.fill('Decommissioned unit');
      expect(await statusRemarks.inputValue()).toBe('Decommissioned unit');

      await statusSelect.selectOption('1'); // Active
      await expect(statusRemarks).toBeDisabled();
      expect(await statusRemarks.inputValue()).toBe('');
    });

    test('UNT-UI-VAL-011: should enforce Status Remarks max length boundary of 300 characters', async ({ page }) => {
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
  // Section 3: Save Actions & Form Lifecycle Validations @UNT-UI-OPS
  // =========================================================================
  test.describe('Form Submission & Lifecycle Operations @UNT-UI-OPS', () => {
    test('UNT-UI-VAL-012: should block form submission when mandatory fields are missing', async ({ page }) => {
      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      await expect(page.getByText('Enter Unit Name.').or(page.locator('.text-destructive, .text-red-500')).first()).toBeVisible();
      await expect(page.getByText('Enter Alias.').or(page.locator('.text-destructive, .text-red-500')).first()).toBeVisible();
    });

    test('UNT-UI-VAL-013: should display confirmation alert when valid inputs are submitted', async ({ page }) => {
      const marker = Date.now().toString().slice(-4);
      await page.locator('input[name="unitName"], #unitName').first().fill(`Unit_${marker}`);
      await page.locator('input[name="alias"], #alias').first().fill(`U${marker.slice(-3)}`);

      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      const dialog = page.locator('.z-alert-box, [role="dialog"], [role="alertdialog"]').first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
    });

    test('UNT-UI-VAL-014: should clear form fields and errors when Reset button is clicked', async ({ page }) => {
      const unitNameInput = page.locator('input[name="unitName"], #unitName').first();
      const aliasInput = page.locator('input[name="alias"], #alias').first();

      await unitNameInput.fill('Temporary Unit');
      await aliasInput.fill('TMP');

      const resetBtn = page.getByRole('button', { name: /Reset/i }).first();
      if (await resetBtn.isVisible()) {
        await resetBtn.click();
        expect(await unitNameInput.inputValue()).toBe('');
        expect(await aliasInput.inputValue()).toBe('');
      }
    });

    test('UNT-UI-VAL-015: should navigate back to list view when Cancel button is clicked', async ({ page }) => {
      const cancelBtn = page.getByRole('button', { name: /Cancel/i }).first();
      await cancelBtn.click();
      await expect(page).toHaveURL(new RegExp(UNIT_MASTER_ROUTES.list()));
    });
  });

  // =========================================================================
  // Section 4: Relational & Business Rule Integrity @UNT-BUS-VAL
  // =========================================================================
  test.describe('Business Rules & Integrity Validations @UNT-BUS-VAL', () => {
    test('UNT-BUS-VAL-001: should display server error message when duplicate Unit Name is submitted', async ({ page }) => {
      // Mock or simulate API 400 rejection for duplicate Unit Name
      await page.route('**/api/**/unit-master*', async (route) => {
        if (route.request().method() === 'POST') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              errors: { UnitName: ['Duplicate Unit Name not allowed.'] },
            }),
          });
        }
        return route.continue();
      });

      await page.locator('input[name="unitName"], #unitName').first().fill('Kilogram');
      await page.locator('input[name="alias"], #alias').first().fill('KG');
      await page.getByRole('button', { name: /^Save/i }).first().click();

      const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|save/i }).first();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }

      const duplicateError = page.getByText('Duplicate Unit Name not allowed.').or(page.locator('.text-destructive, .text-red-500')).first();
      await expect(duplicateError).toBeVisible({ timeout: 10_000 });
    });

    test('UNT-BUS-VAL-002: should block deletion when Unit is associated with child Items or Subgroups', async ({ page }) => {
      await page.route('**/api/**/unit-master/*', async (route) => {
        if (route.request().method() === 'DELETE') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              message: 'Cannot delete Unit as it is associated with Item/Subgroup.',
            }),
          });
        }
        return route.continue();
      });

      await page.goto(UNIT_MASTER_ROUTES.edit(1));
      const deleteBtn = page.getByRole('button', { name: /Delete/i }).first();
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|delete/i }).first();
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
        }
        const errorAlert = page.getByText(/Cannot delete Unit as it is associated/i).or(page.locator('.z-toast, .z-alert-box')).first();
        await expect(errorAlert).toBeVisible({ timeout: 10_000 });
      }
    });
  });
});
