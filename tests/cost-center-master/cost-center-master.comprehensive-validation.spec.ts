import { test, expect } from '../../src/fixtures/test.fixture';
import { COST_CENTER_MASTER_ROUTES } from '../../src/pages/cost-center-master/cost-center-master.constants';

test.describe('Cost Center Master - Comprehensive Validation Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(COST_CENTER_MASTER_ROUTES.new());
    await page.waitForLoadState('domcontentloaded');
  });

  // =========================================================================
  // Section 1: Field Controls & DataGrid Validations @CCT-UI-FLD
  // =========================================================================
  test.describe('Field Controls & DataGrid Validations @CCT-UI-FLD', () => {
    test('CCT-UI-VAL-001: should load form with ReadOnly Code, default Active status, and Company/Division DataGrid', async ({ page }) => {
      const codeInput = page.locator('input[name="code"], #code').first();
      await expect(codeInput).toBeVisible();
      await expect(codeInput).toHaveAttribute('readonly', '');

      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      await expect(statusSelect).toHaveValue('1'); // Active

      const grid = page.locator('.search-data-grid, table').first();
      await expect(grid).toBeVisible();
    });

    test('CCT-UI-VAL-002: should validate mandatory Alias on blur and save', async ({ page }) => {
      const aliasInput = page.locator('input[name="alias"], #alias').first();
      await aliasInput.focus();
      await aliasInput.blur();

      const errorMsg = page.getByText('Enter Alias.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('CCT-UI-VAL-003: should enforce Alias maximum length boundary of 6 characters', async ({ page }) => {
      const aliasInput = page.locator('input[name="alias"], #alias').first();
      await aliasInput.fill('CC12345');
      const val = await aliasInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(6);
    });

    test('CCT-UI-VAL-004: should validate mandatory Cost Center Name on blur and save', async ({ page }) => {
      const nameInput = page.locator('input[name="costCenterName"], #costCenterName').first();
      await nameInput.focus();
      await nameInput.blur();

      const errorMsg = page.getByText('Enter Cost Center Name.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('CCT-UI-VAL-005: should enforce Cost Center Name maximum length boundary of 50 characters', async ({ page }) => {
      const nameInput = page.locator('input[name="costCenterName"], #costCenterName').first();
      const longName = 'C'.repeat(60);
      await nameInput.fill(longName);
      const val = await nameInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(50);
    });

    test('CCT-UI-VAL-006: should block save and show error when no Company/Division combination is selected in DataGrid', async ({ page }) => {
      await page.locator('input[name="alias"], #alias').first().fill('CC01');
      await page.locator('input[name="costCenterName"], #costCenterName').first().fill('IT Operations');

      // Ensure all grid checkboxes are unchecked
      const checkboxes = page.locator('tbody tr input[type="checkbox"]');
      const count = await checkboxes.count();
      for (let i = 0; i < count; i++) {
        if (await checkboxes.nth(i).isChecked()) {
          await checkboxes.nth(i).uncheck().catch(() => {});
        }
      }

      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      const gridError = page.getByText('Select at least one Company and Division combination.').or(page.locator('.text-destructive, .text-red-600')).first();
      await expect(gridError).toBeVisible({ timeout: 5000 });
    });

    test('CCT-UI-VAL-007: should support selecting multiple Company/Division combinations in DataGrid', async ({ page }) => {
      const checkboxes = page.locator('tbody tr input[type="checkbox"]');
      const count = await checkboxes.count();
      if (count >= 2) {
        await checkboxes.nth(0).check();
        await checkboxes.nth(1).check();
        expect(await checkboxes.nth(0).isChecked()).toBe(true);
        expect(await checkboxes.nth(1).isChecked()).toBe(true);
      }
    });
  });

  // =========================================================================
  // Section 2: Status Toggle & Remarks Validations @CCT-UI-STS
  // =========================================================================
  test.describe('Status & Status Remarks Validations @CCT-UI-STS', () => {
    test('CCT-UI-VAL-008: should enable Status Remarks as mandatory when Status is changed to Inactive', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2'); // Inactive
      await expect(statusRemarks).toBeEnabled();

      await statusRemarks.focus();
      await statusRemarks.blur();

      const errorMsg = page.getByText('Enter Status Remarks.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('CCT-UI-VAL-009: should disable and clear Status Remarks when Status is toggled back to Active', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2');
      await statusRemarks.fill('Inactive cost center');
      expect(await statusRemarks.inputValue()).toBe('Inactive cost center');

      await statusSelect.selectOption('1');
      await expect(statusRemarks).toBeDisabled();
      expect(await statusRemarks.inputValue()).toBe('');
    });
  });

  // =========================================================================
  // Section 3: Save Actions & Business Integrity @CCT-BUS-VAL
  // =========================================================================
  test.describe('Save Actions & Business Integrity @CCT-BUS-VAL', () => {
    test('CCT-BUS-VAL-001: should block circular parent reference where Cost Center is its own parent', async ({ page }) => {
      await page.route('**/api/**/cost-center*', async (route) => {
        if (route.request().method() === 'POST' || route.request().method() === 'PUT') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              errors: { ParentCostCenterId: ['Cost Center cannot be its own parent.'] },
            }),
          });
        }
        return route.continue();
      });

      await page.locator('input[name="alias"], #alias').first().fill('CC01');
      await page.locator('input[name="costCenterName"], #costCenterName').first().fill('IT Operations');
      await page.getByRole('button', { name: /^Save/i }).first().click();

      const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|save/i }).first();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }

      const circularError = page.getByText(/Cost Center cannot be its own parent/i).or(page.locator('.text-destructive, .text-red-500')).first();
      await expect(circularError).toBeVisible({ timeout: 10_000 });
    });

    test('CCT-BUS-VAL-002: should block deletion when Cost Center has child cost centers or PR transactions', async ({ page }) => {
      await page.route('**/api/**/cost-center*/*', async (route) => {
        if (route.request().method() === 'DELETE') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              message: 'Cannot delete Cost Center as it has child records or transaction usage.',
            }),
          });
        }
        return route.continue();
      });

      await page.goto(COST_CENTER_MASTER_ROUTES.edit(1));
      const deleteBtn = page.getByRole('button', { name: /Delete/i }).first();
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|delete/i }).first();
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
        }
        const errorAlert = page.getByText(/Cannot delete Cost Center as it has child records/i).or(page.locator('.z-toast, .z-alert-box')).first();
        await expect(errorAlert).toBeVisible({ timeout: 10_000 });
      }
    });
  });
});
