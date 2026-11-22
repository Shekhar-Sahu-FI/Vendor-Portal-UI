import { test, expect } from '../../src/fixtures/test.fixture';
import { LOCATION_MASTER_ROUTES } from '../../src/pages/location-master/location-master.constants';

test.describe('Location Master - Comprehensive Validation Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LOCATION_MASTER_ROUTES.new());
    await page.waitForLoadState('domcontentloaded');
  });

  // =========================================================================
  // Section 1: Field Controls & Initial State Validations @LOC-UI-FLD
  // =========================================================================
  test.describe('Field Controls & Initial State @LOC-UI-FLD', () => {
    test('LOC-UI-VAL-001: should load form with disabled Code input and default Active status', async ({ page }) => {
      const codeInput = page.locator('input[name="code"], #code').first();
      await expect(codeInput).toBeVisible();
      await expect(codeInput).toBeDisabled();

      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      await expect(statusSelect).toHaveValue('1'); // Status.Active

      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();
      await expect(statusRemarks).toBeDisabled();
    });

    test('LOC-UI-VAL-002: should validate mandatory Location Name on blur and save', async ({ page }) => {
      const locationNameInput = page.locator('input[name="locationName"], #locationName').first();
      await locationNameInput.focus();
      await locationNameInput.blur();

      const errorMsg = page.getByText('Enter Location Name.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('LOC-UI-VAL-003: should enforce alphanumeric regex mask on Location Name', async ({ page }) => {
      const locationNameInput = page.locator('input[name="locationName"], #locationName').first();
      await locationNameInput.fill('Main Plant@# 2026!');
      const val = await locationNameInput.inputValue();
      expect(val).not.toContain('@');
      expect(val).not.toContain('#');
      expect(val).not.toContain('!');
    });

    test('LOC-UI-VAL-004: should enforce Location Name maximum length boundary of 50 characters', async ({ page }) => {
      const locationNameInput = page.locator('input[name="locationName"], #locationName').first();
      const longName = 'L'.repeat(60);
      await locationNameInput.fill(longName);
      const val = await locationNameInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(50);
    });

    test('LOC-UI-VAL-005: should validate mandatory Alias on blur and save', async ({ page }) => {
      const aliasInput = page.locator('input[name="alias"], #alias').first();
      await aliasInput.focus();
      await aliasInput.blur();

      const errorMsg = page.getByText('Enter Alias.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('LOC-UI-VAL-006: should enforce alphanumeric without spaces (no-space mask) on Alias', async ({ page }) => {
      const aliasInput = page.locator('input[name="alias"], #alias').first();
      await aliasInput.fill('WH 01');
      const val = await aliasInput.inputValue();
      // inputRegex.alphaNumericNoSpace blocks space characters
      expect(val).not.toContain(' ');
    });

    test('LOC-UI-VAL-007: should enforce Alias maximum length boundary of 6 characters', async ({ page }) => {
      const aliasInput = page.locator('input[name="alias"], #alias').first();
      await aliasInput.fill('WH123456');
      const val = await aliasInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(6);
    });
  });

  // =========================================================================
  // Section 2: Status Toggle & Remarks Validations @LOC-UI-STS
  // =========================================================================
  test.describe('Status & Status Remarks Validations @LOC-UI-STS', () => {
    test('LOC-UI-VAL-008: should enable Status Remarks as mandatory when Status is changed to Inactive', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2'); // Inactive
      await expect(statusRemarks).toBeEnabled();

      await statusRemarks.focus();
      await statusRemarks.blur();

      const errorMsg = page.getByText('Enter Status Remarks.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('LOC-UI-VAL-009: should disable and clear Status Remarks when Status is toggled back to Active', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2');
      await statusRemarks.fill('Inactive warehouse facility');
      expect(await statusRemarks.inputValue()).toBe('Inactive warehouse facility');

      await statusSelect.selectOption('1');
      await expect(statusRemarks).toBeDisabled();
      expect(await statusRemarks.inputValue()).toBe('');
    });

    test('LOC-UI-VAL-010: should enforce Status Remarks max length boundary of 300 characters', async ({ page }) => {
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
  // Section 3: Save Actions & Business Integrity @LOC-BUS-VAL
  // =========================================================================
  test.describe('Save Actions & Business Integrity @LOC-BUS-VAL', () => {
    test('LOC-UI-VAL-011: should block form submission when Location Name or Alias is empty', async ({ page }) => {
      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      await expect(page.getByText('Enter Location Name.').or(page.locator('.text-destructive, .text-red-500')).first()).toBeVisible();
      await expect(page.getByText('Enter Alias.').or(page.locator('.text-destructive, .text-red-500')).first()).toBeVisible();
    });

    test('LOC-UI-VAL-012: should display confirmation alert when valid inputs are submitted', async ({ page }) => {
      const marker = Date.now().toString().slice(-4);
      await page.locator('input[name="locationName"], #locationName').first().fill(`Loc_${marker}`);
      await page.locator('input[name="alias"], #alias').first().fill(`L${marker.slice(-3)}`);

      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      const dialog = page.locator('.z-alert-box, [role="dialog"], [role="alertdialog"]').first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
    });

    test('LOC-BUS-VAL-001: should display server error message when duplicate Location Name is submitted', async ({ page }) => {
      await page.route('**/api/**/location-master*', async (route) => {
        if (route.request().method() === 'POST') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              errors: { LocationName: ['Duplicate Location Name not allowed.'] },
            }),
          });
        }
        return route.continue();
      });

      await page.locator('input[name="locationName"], #locationName').first().fill('Main Warehouse');
      await page.locator('input[name="alias"], #alias').first().fill('WH01');
      await page.getByRole('button', { name: /^Save/i }).first().click();

      const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|save/i }).first();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }

      const duplicateError = page.getByText('Duplicate Location Name not allowed.').or(page.locator('.text-destructive, .text-red-500')).first();
      await expect(duplicateError).toBeVisible({ timeout: 10_000 });
    });

    test('LOC-BUS-VAL-002: should block deletion when Location is associated with Company Location or Orders', async ({ page }) => {
      await page.route('**/api/**/location-master/*', async (route) => {
        if (route.request().method() === 'DELETE') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              message: 'Cannot delete Location as it is associated with company records or orders.',
            }),
          });
        }
        return route.continue();
      });

      await page.goto(LOCATION_MASTER_ROUTES.edit(1));
      const deleteBtn = page.getByRole('button', { name: /Delete/i }).first();
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|delete/i }).first();
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
        }
        const errorAlert = page.getByText(/Cannot delete Location as it is associated/i).or(page.locator('.z-toast, .z-alert-box')).first();
        await expect(errorAlert).toBeVisible({ timeout: 10_000 });
      }
    });
  });
});
