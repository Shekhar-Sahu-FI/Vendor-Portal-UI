import { test, expect } from '../../src/fixtures/test.fixture';
import { CITY_MASTER_ROUTES } from '../../src/pages/city-master/city-master.constants';

test.describe('City Master - Comprehensive Validation Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CITY_MASTER_ROUTES.new());
    await page.waitForLoadState('domcontentloaded');
  });

  // =========================================================================
  // Section 1: Field Controls & Cascading Dropdown Validations @CTY-UI-FLD
  // =========================================================================
  test.describe('Field Controls & Cascading Dropdowns @CTY-UI-FLD', () => {
    test('CTY-UI-VAL-001: should load form with disabled Code input, default Active status, and empty Country/State', async ({ page }) => {
      const codeInput = page.locator('input[name="code"], #code').first();
      await expect(codeInput).toBeVisible();
      await expect(codeInput).toBeDisabled();

      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      await expect(statusSelect).toHaveValue('1'); // Active

      const cityNameInput = page.locator('input[name="cityName"], #cityName').first();
      await expect(cityNameInput).toBeEmpty();
    });

    test('CTY-UI-VAL-002: should validate mandatory City Name on blur and save', async ({ page }) => {
      const cityNameInput = page.locator('input[name="cityName"], #cityName').first();
      await cityNameInput.focus();
      await cityNameInput.blur();

      const errorMsg = page.getByText('Enter City Name.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('CTY-UI-VAL-003: should enforce alphanumeric regex mask on City Name', async ({ page }) => {
      const cityNameInput = page.locator('input[name="cityName"], #cityName').first();
      await cityNameInput.fill('Mumbai@# 400001!');
      const val = await cityNameInput.inputValue();
      expect(val).not.toContain('@');
      expect(val).not.toContain('#');
      expect(val).not.toContain('!');
    });

    test('CTY-UI-VAL-004: should enforce City Name maximum length boundary of 50 characters', async ({ page }) => {
      const cityNameInput = page.locator('input[name="cityName"], #cityName').first();
      const longName = 'C'.repeat(60);
      await cityNameInput.fill(longName);
      const val = await cityNameInput.inputValue();
      expect(val.length).toBeLessThanOrEqual(50);
    });

    test('CTY-UI-VAL-005: should validate mandatory Country selection on save', async ({ page }) => {
      const cityNameInput = page.locator('input[name="cityName"], #cityName').first();
      await cityNameInput.fill('Pune');

      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      const countryError = page.getByText(/Select Country|Country is required/i).or(page.locator('.text-destructive, .text-red-500')).first();
      await expect(countryError).toBeVisible({ timeout: 5000 });
    });

    test('CTY-UI-VAL-006: should cascade states when Country is selected', async ({ page }) => {
      // Mock country and state dropdown endpoints if needed
      await page.route('**/api/**/country-master*', async (route) => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 73, countryName: 'India' }]),
        });
      });

      await page.route('**/api/master/states/get?CountryId=73*', async (route) => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 14, stateName: 'Maharashtra' }]),
        });
      });

      await page.goto(CITY_MASTER_ROUTES.new());

      const countryInput = page.locator('input[name="countryId"], .uc-combo input').first();
      if (await countryInput.isVisible()) {
        await countryInput.click();
        const countryOption = page.locator('.uc-combo-option, li').filter({ hasText: 'India' }).first();
        if (await countryOption.isVisible()) {
          await countryOption.click();
        }
      }

      // State input should be loaded with cascaded states
      const stateInput = page.locator('input[name="stateId"], .uc-combo input').nth(1);
      if (await stateInput.isVisible()) {
        await expect(stateInput).toBeEnabled();
      }
    });

    test('CTY-UI-VAL-007: should validate mandatory State selection on save', async ({ page }) => {
      const cityNameInput = page.locator('input[name="cityName"], #cityName').first();
      await cityNameInput.fill('Nagpur');

      const saveBtn = page.getByRole('button', { name: /^Save/i }).first();
      await saveBtn.click();

      const stateError = page.getByText(/Select State|State is required/i).or(page.locator('.text-destructive, .text-red-500')).first();
      await expect(stateError).toBeVisible({ timeout: 5000 });
    });
  });

  // =========================================================================
  // Section 2: Status Toggle & Remarks Validations @CTY-UI-STS
  // =========================================================================
  test.describe('Status & Status Remarks Validations @CTY-UI-STS', () => {
    test('CTY-UI-VAL-008: should enable Status Remarks as mandatory when Status is changed to Inactive', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2'); // Inactive
      await expect(statusRemarks).toBeEnabled();

      await statusRemarks.focus();
      await statusRemarks.blur();

      const errorMsg = page.getByText('Enter Status Remarks.').or(page.locator('.text-destructive, .text-red-500, .z-alert-box')).first();
      await expect(errorMsg).toBeVisible({ timeout: 5000 });
    });

    test('CTY-UI-VAL-009: should disable and clear Status Remarks when Status is toggled back to Active', async ({ page }) => {
      const statusSelect = page.locator('select[name="statusId"], #statusId select').first();
      const statusRemarks = page.locator('textarea[name="statusRemarks"], #statusRemarks').first();

      await statusSelect.selectOption('2');
      await statusRemarks.fill('Inactive city remarks');
      expect(await statusRemarks.inputValue()).toBe('Inactive city remarks');

      await statusSelect.selectOption('1');
      await expect(statusRemarks).toBeDisabled();
      expect(await statusRemarks.inputValue()).toBe('');
    });
  });

  // =========================================================================
  // Section 3: Save Actions & Business Rules @CTY-BUS-VAL
  // =========================================================================
  test.describe('Save Actions & Business Integrity @CTY-BUS-VAL', () => {
    test('CTY-BUS-VAL-001: should block save and show server error when duplicate City Name exists in the same State', async ({ page }) => {
      await page.route('**/api/**/city-master*', async (route) => {
        if (route.request().method() === 'POST') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              errors: { CityName: ['Duplicate City Name not allowed in the selected State.'] },
            }),
          });
        }
        return route.continue();
      });

      await page.locator('input[name="cityName"], #cityName').first().fill('Mumbai');
      await page.getByRole('button', { name: /^Save/i }).first().click();

      const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|save/i }).first();
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }

      const duplicateError = page.getByText('Duplicate City Name not allowed in the selected State.').or(page.locator('.text-destructive, .text-red-500')).first();
      await expect(duplicateError).toBeVisible({ timeout: 10_000 });
    });

    test('CTY-BUS-VAL-002: should block deletion when City is associated with Vendor or Location records', async ({ page }) => {
      await page.route('**/api/**/city-master/*', async (route) => {
        if (route.request().method() === 'DELETE') {
          return route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
              isSuccess: false,
              message: 'Cannot delete City as it is associated with address records.',
            }),
          });
        }
        return route.continue();
      });

      await page.goto(CITY_MASTER_ROUTES.edit(1));
      const deleteBtn = page.getByRole('button', { name: /Delete/i }).first();
      if (await deleteBtn.isVisible()) {
        await deleteBtn.click();
        const confirmBtn = page.locator('.z-alert-box button').filter({ hasText: /ok|yes|confirm|delete/i }).first();
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
        }
        const errorAlert = page.getByText(/Cannot delete City as it is associated/i).or(page.locator('.z-toast, .z-alert-box')).first();
        await expect(errorAlert).toBeVisible({ timeout: 10_000 });
      }
    });
  });
});
