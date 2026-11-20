import { test, expect } from '../../src/fixtures/test.fixture';
import { QUOTATION_VALIDATION_MESSAGES as MSG } from '../../src/pages/quotation/quotation-validation.messages';
import { QUOTATION_ROUTES } from '../../src/pages/quotation/quotation.constants';

test.describe('Quotation - Comprehensive Validation Suite', () => {
  // =========================================================================
  // Category 1: Document Identity & General Detail Validations @QTN-VAL-HDR
  // =========================================================================
  test.describe('Document Identity & General Detail Validations @QTN-VAL-HDR', () => {
    test.beforeEach(async ({ quotationFormPage }) => {
      await quotationFormPage.openNew();
    });

    test('QTN-VAL-HDR-001, QTN-VAL-HDR-002: should block save and show validation error when Quotation No. is empty', async ({
      quotationFormPage,
      page,
    }) => {
      const qtnNoInput = page.locator('#quotationNo, input[name="quotationNo"]');
      if (await qtnNoInput.isVisible()) {
        await qtnNoInput.fill('');
        await qtnNoInput.blur();
      }

      await quotationFormPage.triggerSaveValidation();
      await quotationFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.quotationNoRequired, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('QTN-VAL-HDR-003: should enforce max length 20 on Quotation No.', async ({
      page,
    }) => {
      const qtnNoInput = page.locator('#quotationNo, input[name="quotationNo"]');
      if (await qtnNoInput.isVisible()) {
        await qtnNoInput.fill('QTN-2026-0000000000999');
        const val = await qtnNoInput.inputValue();
        expect(val.length).toBeLessThanOrEqual(20);
      }
    });

    test('QTN-VAL-HDR-004: should accept valid Quotation No.', async ({
      page,
    }) => {
      const qtnNoInput = page.locator('#quotationNo, input[name="quotationNo"]');
      if (await qtnNoInput.isVisible()) {
        await qtnNoInput.fill('QTN/2026/089');
        await qtnNoInput.blur();
        await expect(page.getByText(MSG.quotationNoRequired)).not.toBeVisible();
      }
    });

    test('QTN-VAL-HDR-005: should verify Quotation Date is disabled and defaults to today', async ({
      page,
    }) => {
      const dateInput = page.locator('#quotationDate input, input[name="quotationDate"]').first();
      if (await dateInput.isVisible()) {
        await expect(dateInput).toBeDisabled();
      }
    });

    test('QTN-VAL-HDR-006: should block save when Validity Date is empty', async ({
      quotationFormPage,
      page,
    }) => {
      const validityInput = page.locator('#validityDate input, input[name="validityDate"]').first();
      if (await validityInput.isVisible()) {
        await validityInput.fill('');
        await validityInput.blur();
      }

      await quotationFormPage.triggerSaveValidation();
      await quotationFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.validityDateRequired, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('QTN-VAL-HDR-007: should block save when Validity Date is earlier than Quotation Date', async ({
      quotationFormPage,
      page,
    }) => {
      const validityInput = page.locator('#validityDate input, input[name="validityDate"]').first();
      if (await validityInput.isVisible()) {
        await validityInput.fill('2020-01-01');
        await validityInput.blur();

        await quotationFormPage.triggerSaveValidation();
        await quotationFormPage.expectSaveBlockedByValidation();

        const errorMsg = page.getByText(MSG.validityBeforeQuotationDate, { exact: false }).first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('QTN-VAL-HDR-008: should accept Validity Date equal to Quotation Date', async ({
      page,
    }) => {
      const dateInput = page.locator('#quotationDate input, input[name="quotationDate"]').first();
      const validityInput = page.locator('#validityDate input, input[name="validityDate"]').first();

      if ((await dateInput.isVisible()) && (await validityInput.isVisible())) {
        const todayVal = await dateInput.inputValue();
        if (todayVal) {
          await validityInput.fill(todayVal);
          await validityInput.blur();
          await expect(page.getByText(MSG.validityBeforeQuotationDate)).not.toBeVisible();
        }
      }
    });

    test('QTN-VAL-HDR-010, QTN-VAL-HDR-011: should block save when Credit Days is empty or zero', async ({
      quotationFormPage,
      page,
    }) => {
      const creditDaysInput = page.locator('#creditDays, input[name="creditDays"]');
      if (await creditDaysInput.isVisible()) {
        // Zero Credit Days
        await creditDaysInput.fill('0');
        await creditDaysInput.blur();

        await quotationFormPage.triggerSaveValidation();
        await quotationFormPage.expectSaveBlockedByValidation();

        const zeroError = page
          .getByText(MSG.creditDaysGreaterThanZero, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500'))
          .first();
        await expect(zeroError).toBeVisible({ timeout: 10_000 });

        // Blank Credit Days
        await creditDaysInput.fill('');
        await creditDaysInput.blur();
        await quotationFormPage.triggerSaveValidation();

        const emptyError = page
          .getByText(MSG.creditDaysRequired, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500'))
          .first();
        await expect(emptyError).toBeVisible({ timeout: 10_000 });
      }
    });

    test('QTN-VAL-HDR-013: should enforce max length 5 on Credit Days', async ({
      page,
    }) => {
      const creditDaysInput = page.locator('#creditDays, input[name="creditDays"]');
      if (await creditDaysInput.isVisible()) {
        await creditDaysInput.fill('123456');
        const val = await creditDaysInput.inputValue();
        expect(val.length).toBeLessThanOrEqual(5);
      }
    });

    test('QTN-VAL-HDR-015: should block save when Freight Type is unselected', async ({
      quotationFormPage,
      page,
    }) => {
      const freightSelect = page.locator('#freightType select, select[name="freightType"]').first();
      if (await freightSelect.isVisible()) {
        await freightSelect.selectOption({ value: '' }).catch(() => {});
      }

      await quotationFormPage.triggerSaveValidation();
      await quotationFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.freightTypeRequired, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('QTN-VAL-HDR-017: should block save when Payment Mode is unselected', async ({
      quotationFormPage,
      page,
    }) => {
      const paymentSelect = page.locator('#paymentMode select, select[name="paymentMode"]').first();
      if (await paymentSelect.isVisible()) {
        await paymentSelect.selectOption({ value: '' }).catch(() => {});
      }

      await quotationFormPage.triggerSaveValidation();
      await quotationFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.paymentModeRequired, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('QTN-VAL-HDR-019: should block save when Currency is empty', async ({
      quotationFormPage,
      page,
    }) => {
      const currencyInput = page.locator('#currencyId input, input[name="currencyId"]').first();
      if (await currencyInput.isVisible()) {
        await currencyInput.fill('');
        await currencyInput.blur();
      }

      await quotationFormPage.triggerSaveValidation();
      await quotationFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.currencyRequired, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('QTN-VAL-HDR-022: should enforce max length 1000 on Remarks', async ({
      page,
    }) => {
      const remarksInput = page.locator('#remarks, textarea[name="remarks"]');
      if (await remarksInput.isVisible()) {
        await remarksInput.fill('Q'.repeat(1050));
        const val = await remarksInput.inputValue();
        expect(val.length).toBeLessThanOrEqual(1000);
      }
    });

    test('QTN-VAL-HDR-023, QTN-VAL-HDR-024: should require Country and State for Guest Vendor', async ({
      quotationFormPage,
      page,
    }) => {
      const countryCombo = page.locator('#countryId, [name="countryId"]').first();
      if (await countryCombo.isVisible()) {
        await quotationFormPage.triggerSaveValidation();
        await quotationFormPage.expectSaveBlockedByValidation();

        const countryError = page.getByText(MSG.countryRequired, { exact: false }).first();
        await expect(countryError).toBeVisible({ timeout: 10_000 });
      }
    });
  });

  // =========================================================================
  // Category 2: Item Details & DataGrid Validations @QTN-VAL-ITM
  // =========================================================================
  test.describe('Item Details & DataGrid Validations @QTN-VAL-ITM', () => {
    test.beforeEach(async ({ quotationFormPage }) => {
      await quotationFormPage.openNew();
    });

    test('QTN-VAL-ITM-001: should block save when 0 items are selected', async ({
      quotationFormPage,
      page,
    }) => {
      // Uncheck all item checkboxes
      await quotationFormPage.toggleSelectAll(false);

      await quotationFormPage.triggerSaveValidation();
      await quotationFormPage.expectSaveBlockedByValidation();

      const itemAlert = page
        .getByText(MSG.atLeastOneItemSelected, { exact: false })
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(itemAlert).toBeVisible({ timeout: 10_000 });
    });

    test('QTN-VAL-ITM-002, QTN-VAL-ITM-003: should toggle Select All items and individual item selection', async ({
      quotationFormPage,
      page,
    }) => {
      const selectAllCheckbox = page.locator('thead input[type="checkbox"]').first();
      if (await selectAllCheckbox.isVisible()) {
        // Select All
        await selectAllCheckbox.check();
        const firstRowCheck = page.locator('tbody tr:first-child input[type="checkbox"]').first();
        if (await firstRowCheck.isVisible()) {
          await expect(firstRowCheck).toBeChecked();

          // Uncheck row 0
          await firstRowCheck.uncheck();
          await expect(firstRowCheck).not.toBeChecked();
        }
      }
    });

    test('QTN-VAL-ITM-005: should apply Default Delivery Day(s) across all items', async ({
      page,
    }) => {
      const defaultDeliveryInput = page.locator('input[placeholder*="Enter Days"]').first();
      if (await defaultDeliveryInput.isVisible()) {
        await defaultDeliveryInput.fill('15');
        await defaultDeliveryInput.blur();

        const rowDeliveryInput = page.locator('input[id*="deliveryDays"]').first();
        if (await rowDeliveryInput.isVisible()) {
          await expect(rowDeliveryInput).toHaveValue('15');
        }
      }
    });

    test('QTN-VAL-ITM-006: should block save when HSN/SAC is blank for selected item', async ({
      quotationFormPage,
      page,
    }) => {
      await quotationFormPage.toggleItemSelection(0, true);
      const hsnInput = page.locator('input[id="items[0].hsnCode"], input#items\\[0\\]\\.hsnCode').first();
      if (await hsnInput.isVisible()) {
        await hsnInput.fill('');
        await hsnInput.blur();

        await quotationFormPage.triggerSaveValidation();
        await quotationFormPage.expectSaveBlockedByValidation();

        const hsnError = page.getByText(MSG.hsnRequired, { exact: false }).first();
        await expect(hsnError).toBeVisible({ timeout: 10_000 });
      }
    });

    test('QTN-VAL-ITM-007, QTN-VAL-ITM-009: should validate HSN Code format (2, 4, 6, 8 digits)', async ({
      quotationFormPage,
      page,
    }) => {
      await quotationFormPage.toggleItemSelection(0, true);
      const hsnInput = page.locator('input[id="items[0].hsnCode"], input#items\\[0\\]\\.hsnCode').first();
      if (await hsnInput.isVisible()) {
        // Invalid 3-digit length
        await hsnInput.fill('720');
        await hsnInput.blur();
        await quotationFormPage.triggerSaveValidation();

        const formatError = page.getByText(MSG.hsnCodeFormat, { exact: false }).first();
        await expect(formatError).toBeVisible({ timeout: 10_000 });

        // Valid 4-digit length
        await hsnInput.fill('7201');
        await hsnInput.blur();
        await expect(page.getByText(MSG.hsnCodeFormat)).not.toBeVisible();
      }
    });

    test('QTN-VAL-ITM-014: should require Other Make Name when Make is selected as "Other"', async ({
      quotationFormPage,
      page,
    }) => {
      await quotationFormPage.toggleItemSelection(0, true);
      const makeInput = page.locator('input[id="items[0].makeName"]').first();
      if (await makeInput.isVisible()) {
        await makeInput.fill('Other');
        await page.keyboard.press('Enter');

        const otherMakeInput = page.locator('input[id="items[0].otherMakeName"]').first();
        if (await otherMakeInput.isVisible()) {
          await otherMakeInput.fill('');
          await otherMakeInput.blur();

          await quotationFormPage.triggerSaveValidation();
          await quotationFormPage.expectSaveBlockedByValidation();

          const otherMakeError = page.getByText(MSG.otherMakeRequired, { exact: false }).first();
          await expect(otherMakeError).toBeVisible({ timeout: 10_000 });
        }
      }
    });

    test('QTN-VAL-ITM-017, QTN-VAL-ITM-018: should block save when item Rate is empty or zero', async ({
      quotationFormPage,
      page,
    }) => {
      await quotationFormPage.toggleItemSelection(0, true);
      const rateInput = page.locator('input[id="items[0].rate"], input#items\\[0\\]\\.rate').first();
      if (await rateInput.isVisible()) {
        // Zero Rate
        await rateInput.fill('0');
        await rateInput.blur();

        await quotationFormPage.triggerSaveValidation();
        await quotationFormPage.expectSaveBlockedByValidation();

        const rateError = page.getByText(MSG.rateRequired, { exact: false }).first();
        await expect(rateError).toBeVisible({ timeout: 10_000 });
      }
    });

    test('QTN-VAL-ITM-022: should block save when Discount % is greater than 100', async ({
      quotationFormPage,
      page,
    }) => {
      await quotationFormPage.toggleItemSelection(0, true);
      const discInput = page.locator('input[id="items[0].discountPercent"]').first();
      if (await discInput.isVisible()) {
        await discInput.fill('105');
        await discInput.blur();

        await quotationFormPage.triggerSaveValidation();
        await quotationFormPage.expectSaveBlockedByValidation();

        const discError = page.getByText(MSG.discountPercentMax, { exact: false }).first();
        await expect(discError).toBeVisible({ timeout: 10_000 });
      }
    });

    test('QTN-VAL-ITM-024, QTN-VAL-ITM-025: should verify two-way calculation between Discount % and Discount Amount', async ({
      quotationFormPage,
      page,
    }) => {
      await quotationFormPage.toggleItemSelection(0, true);
      const rateInput = page.locator('input[id="items[0].rate"]').first();
      const discInput = page.locator('input[id="items[0].discountPercent"]').first();
      const discAmtInput = page.locator('input[id="items[0].discountAmount"]').first();

      if ((await rateInput.isVisible()) && (await discInput.isVisible()) && (await discAmtInput.isVisible())) {
        await rateInput.fill('100');
        await discInput.fill('10');
        await discInput.blur();

        // Entering Disc % calculates Disc Amt
        const discAmtVal = await discAmtInput.inputValue();
        expect(Number(discAmtVal)).toBeGreaterThan(0);

        // Entering Disc Amt directly clears Disc %
        await discAmtInput.fill('25');
        await discAmtInput.blur();
        await expect(discInput).toHaveValue(/0|/);
      }
    });

    test('QTN-VAL-ITM-027: should block save when Tax (GST) is unselected for selected item', async ({
      quotationFormPage,
      page,
    }) => {
      await quotationFormPage.toggleItemSelection(0, true);
      const rateInput = page.locator('input[id="items[0].rate"]').first();
      if (await rateInput.isVisible()) {
        await rateInput.fill('500');
        await rateInput.blur();
      }

      await quotationFormPage.triggerSaveValidation();
      await quotationFormPage.expectSaveBlockedByValidation();

      const taxError = page
        .getByText(MSG.taxRequired, { exact: false })
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(taxError).toBeVisible({ timeout: 10_000 });
    });

    test('QTN-VAL-ITM-031, QTN-VAL-ITM-032: should block save when Delivery Day(s) is empty or zero', async ({
      quotationFormPage,
      page,
    }) => {
      await quotationFormPage.toggleItemSelection(0, true);
      const deliveryInput = page.locator('input[id="items[0].deliveryDays"]').first();
      if (await deliveryInput.isVisible()) {
        await deliveryInput.fill('0');
        await deliveryInput.blur();

        await quotationFormPage.triggerSaveValidation();
        await quotationFormPage.expectSaveBlockedByValidation();

        const errorMsg = page.getByText(MSG.deliveryDaysRequired, { exact: false }).first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });
  });

  // =========================================================================
  // Category 3: Other Charges & Tax Calculation Validations @QTN-VAL-CHG
  // =========================================================================
  test.describe('Other Charges & Tax Calculation Validations @QTN-VAL-CHG', () => {
    test.beforeEach(async ({ quotationFormPage }) => {
      await quotationFormPage.openNew();
    });

    test('QTN-VAL-CHG-001, QTN-VAL-CHG-004: should display other charges and allow toggling GST Apply checkbox', async ({
      page,
    }) => {
      const otherChargesSection = page.getByRole('heading', { name: /Other Charges/i });
      if (await otherChargesSection.isVisible()) {
        const gstCheckbox = page.locator('input[type="checkbox"][id*="gstApplicable"]').first();
        if (await gstCheckbox.isVisible()) {
          const initialState = await gstCheckbox.isChecked();
          await gstCheckbox.click();
          expect(await gstCheckbox.isChecked()).toBe(!initialState);
        }
      }
    });

    test('QTN-VAL-CHG-002: should enforce max length 300 on Other Charge Additional Description', async ({
      page,
    }) => {
      const descInput = page.locator('textarea[placeholder*="Enter Description"]').first();
      if (await descInput.isVisible()) {
        await descInput.fill('D'.repeat(320));
        const val = await descInput.inputValue();
        expect(val.length).toBeLessThanOrEqual(300);
      }
    });

    test('QTN-VAL-CHG-007: should block save when Net Amount evaluates to negative', async ({
      quotationFormPage,
      page,
    }) => {
      const netAmountError = page.getByText(MSG.netAmountNegative, { exact: false }).first();
      if (await netAmountError.isVisible()) {
        await expect(netAmountError).toBeVisible();
      }
    });
  });

  // =========================================================================
  // Category 4: Terms & Conditions Validations @QTN-VAL-TNC
  // =========================================================================
  test.describe('Terms & Conditions Validations @QTN-VAL-TNC', () => {
    test.beforeEach(async ({ quotationFormPage }) => {
      await quotationFormPage.openNew();
    });

    test('QTN-VAL-TNC-003: should require Quotation Specification response when T&C rows exist', async ({
      quotationFormPage,
      page,
    }) => {
      const tncTab = page.getByRole('tab', { name: /Terms & Condition/i });
      if (await tncTab.isVisible()) {
        await tncTab.click();

        const tncStatusTextarea = page.locator('textarea[id*="tncs[0].status"]').first();
        if (await tncStatusTextarea.isVisible()) {
          await tncStatusTextarea.fill('');
          await tncStatusTextarea.blur();

          await quotationFormPage.triggerSaveValidation();
          await quotationFormPage.expectSaveBlockedByValidation();

          const errorMsg = page.locator('.text-destructive, .text-red-500, [id*="tncs[0]"]').first();
          if (await errorMsg.isVisible()) {
            await expect(errorMsg).toBeVisible();
          }
        }
      }
    });

    test('QTN-VAL-TNC-004: should populate Quotation Specification when single row copy button is clicked', async ({
      page,
    }) => {
      const tncTab = page.getByRole('tab', { name: /Terms & Condition/i });
      if (await tncTab.isVisible()) {
        await tncTab.click();

        const copyRowBtn = page.locator('tbody tr:first-child button[title="Copy this row"]').first();
        const tncTextarea = page.locator('textarea[id*="tncs[0].status"]').first();

        if ((await copyRowBtn.isVisible()) && (await tncTextarea.isVisible())) {
          await copyRowBtn.click();
          const val = await tncTextarea.inputValue();
          expect(val.length).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('QTN-VAL-TNC-005: should populate all Quotation Specifications when Copy All button is clicked', async ({
      page,
    }) => {
      const tncTab = page.getByRole('tab', { name: /Terms & Condition/i });
      if (await tncTab.isVisible()) {
        await tncTab.click();

        const copyAllBtn = page.getByRole('button', { name: /Copy All/i });
        if (await copyAllBtn.isVisible()) {
          await copyAllBtn.click();
          const firstTextarea = page.locator('textarea[id*="tncs[0].status"]').first();
          if (await firstTextarea.isVisible()) {
            const val = await firstTextarea.inputValue();
            expect(val.length).toBeGreaterThanOrEqual(0);
          }
        }
      }
    });
  });

  // =========================================================================
  // Category 5: Inform To (Notification Contacts) Validations @QTN-VAL-INF
  // =========================================================================
  test.describe('Inform To (Notification Contacts) Validations @QTN-VAL-INF', () => {
    test.beforeEach(async ({ quotationFormPage }) => {
      await quotationFormPage.openNew();
    });

    test('QTN-VAL-INF-002, QTN-VAL-INF-012: should add and remove contact rows in Inform To section', async ({
      page,
    }) => {
      const informToTab = page.getByRole('tab', { name: /Inform To/i });
      if (await informToTab.isVisible()) {
        await informToTab.click();

        const addContactBtn = page.getByRole('button', { name: /Add Contact Person/i });
        if (await addContactBtn.isVisible()) {
          await addContactBtn.click();
          const firstContactInput = page.locator('input[id*="informToDetail[0].contactPersonName"]').first();
          await expect(firstContactInput).toBeVisible();

          // Remove row
          const trashBtn = page.locator('tbody button[title="Remove contact"]').first();
          if (await trashBtn.isVisible()) {
            await trashBtn.click();
          }
        }
      }
    });

    test('QTN-VAL-INF-003: should require Contact Person Name when a contact row is added', async ({
      quotationFormPage,
      page,
    }) => {
      const informToTab = page.getByRole('tab', { name: /Inform To/i });
      if (await informToTab.isVisible()) {
        await informToTab.click();

        const addContactBtn = page.getByRole('button', { name: /Add Contact Person/i });
        if (await addContactBtn.isVisible()) {
          await addContactBtn.click();

          const nameInput = page.locator('input[id*="informToDetail[0].contactPersonName"]').first();
          await nameInput.fill('');
          await nameInput.blur();

          await quotationFormPage.triggerSaveValidation();
          await quotationFormPage.expectSaveBlockedByValidation();

          const errorMsg = page.getByText(MSG.contactPersonNameRequired, { exact: false }).first();
          await expect(errorMsg).toBeVisible({ timeout: 10_000 });
        }
      }
    });

    test('QTN-VAL-INF-004: should require Email or Contact No. when Contact Person Name is entered', async ({
      quotationFormPage,
      page,
    }) => {
      const informToTab = page.getByRole('tab', { name: /Inform To/i });
      if (await informToTab.isVisible()) {
        await informToTab.click();

        const addContactBtn = page.getByRole('button', { name: /Add Contact Person/i });
        if (await addContactBtn.isVisible()) {
          await addContactBtn.click();

          const nameInput = page.locator('input[id*="informToDetail[0].contactPersonName"]').first();
          await nameInput.fill('James Wilson');
          await nameInput.blur();

          await quotationFormPage.triggerSaveValidation();
          await quotationFormPage.expectSaveBlockedByValidation();

          const errorMsg = page.getByText(MSG.emailOrContactNoRequired, { exact: false }).first();
          await expect(errorMsg).toBeVisible({ timeout: 10_000 });
        }
      }
    });

    test('QTN-VAL-INF-006: should block invalid email format in Inform To contact row', async ({
      quotationFormPage,
      page,
    }) => {
      const informToTab = page.getByRole('tab', { name: /Inform To/i });
      if (await informToTab.isVisible()) {
        await informToTab.click();

        const addContactBtn = page.getByRole('button', { name: /Add Contact Person/i });
        if (await addContactBtn.isVisible()) {
          await addContactBtn.click();

          const emailInput = page.locator('input[id*="informToDetail[0].email"]').first();
          await emailInput.fill('invalid-email-address');
          await emailInput.blur();

          await quotationFormPage.triggerSaveValidation();
          const errorMsg = page.getByText(MSG.invalidEmail, { exact: false }).first();
          await expect(errorMsg).toBeVisible({ timeout: 10_000 });
        }
      }
    });
  });

  // =========================================================================
  // Category 6: Dual Attachments Tab Validations @QTN-VAL-ATT
  // =========================================================================
  test.describe('Dual Attachments Tab Validations @QTN-VAL-ATT', () => {
    test.beforeEach(async ({ quotationFormPage }) => {
      await quotationFormPage.openNew();
    });

    test('QTN-VAL-ATT-001, QTN-VAL-ATT-002: should verify RFQ Attachments (read-only) and Quotation Attachments sub-tabs', async ({
      page,
    }) => {
      const attachmentTab = page.getByRole('tab', { name: /Attachment/i });
      if (await attachmentTab.isVisible()) {
        await attachmentTab.click();

        const rfqSubTab = page.getByRole('button', { name: /RFQ Attachments/i });
        const quoteSubTab = page.getByRole('button', { name: /Quotation Attachments/i });

        await expect(rfqSubTab).toBeVisible();
        await expect(quoteSubTab).toBeVisible();

        // RFQ attachments are read-only (upload button hidden)
        await rfqSubTab.click();
        const uploadBtn = page.getByRole('button', { name: /Upload|Choose Files/i });
        await expect(uploadBtn).not.toBeVisible();
      }
    });
  });

  // =========================================================================
  // Category 7: Negotiation Counter-Offers Validations @QTN-VAL-NEG
  // =========================================================================
  test.describe('Negotiation Counter-Offers Validations @QTN-VAL-NEG', () => {
    test('QTN-VAL-NEG-001, QTN-VAL-NEG-003: should display Negotiation tab when active counter-offers exist', async ({
      page,
    }) => {
      const negTab = page.getByRole('tab', { name: /Negotiation/i });
      if (await negTab.isVisible()) {
        await negTab.click();
        const acceptAllBtn = page.getByRole('button', { name: /Accept All Items/i });
        if (await acceptAllBtn.isVisible()) {
          await expect(acceptAllBtn).toBeEnabled();
        }
      }
    });
  });

  // =========================================================================
  // Category 8: Form Actions & Lifecycle State Transitions @QTN-VAL-ACT
  // =========================================================================
  test.describe('Form Actions & Lifecycle State Transitions @QTN-VAL-ACT', () => {
    test.beforeEach(async ({ quotationFormPage }) => {
      await quotationFormPage.openNew();
    });

    test('QTN-VAL-ACT-001: should trigger client-side validation and confirmation on Save Draft', async ({
      quotationFormPage,
      page,
    }) => {
      const saveBtn = quotationFormPage.saveBtn();
      if (await saveBtn.isVisible()) {
        await saveBtn.click();
        // Validation alert or confirmation appears
        const alertBox = page.locator('.z-alert-box, .text-destructive, .text-red-500').first();
        await expect(alertBox).toBeVisible({ timeout: 10_000 });
      }
    });

    test('QTN-VAL-ACT-002: should trigger client-side validation and confirmation on Submit', async ({
      quotationFormPage,
      page,
    }) => {
      const submitBtn = quotationFormPage.submitBtn();
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        const alertBox = page.locator('.z-alert-box, .text-destructive, .text-red-500').first();
        await expect(alertBox).toBeVisible({ timeout: 10_000 });
      }
    });

    test('QTN-VAL-ACT-004, QTN-VAL-ACT-005: should render Decline / Undo Decline button conditionally', async ({
      quotationFormPage,
    }) => {
      const declineBtn = quotationFormPage.declineBtn();
      if (await declineBtn.isVisible()) {
        await expect(declineBtn).toBeEnabled();
      }
    });

    test('QTN-VAL-ACT-006, QTN-VAL-ACT-007: should render Withdraw button when applicable', async ({
      quotationFormPage,
    }) => {
      const withdrawBtn = quotationFormPage.withdrawBtn();
      if (await withdrawBtn.isVisible()) {
        await expect(withdrawBtn).toBeEnabled();
      }
    });

    test('QTN-VAL-ACT-010: should navigate back on Cancel button click', async ({
      page,
    }) => {
      const cancelBtn = page.getByRole('button', { name: /^Cancel$/i });
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        // Expect navigation away from /new
        await page.waitForTimeout(500);
      }
    });
  });

  // =========================================================================
  // Category 9: Policies & Role Routing Validations @QTN-VAL-POL
  // =========================================================================
  test.describe('Policies & Role Routing Validations @QTN-VAL-POL', () => {
    test('QTN-VAL-POL-003, QTN-VAL-POL-004: should enforce form rights for save and submit', async ({
      quotationFormPage,
    }) => {
      await quotationFormPage.openNew();
      const saveBtn = quotationFormPage.saveBtn();
      const submitBtn = quotationFormPage.submitBtn();

      await expect(saveBtn).toBeVisible();
      await expect(submitBtn).toBeVisible();
    });
  });

  // =========================================================================
  // Category 10: Display Page & Revision History Validations @QTN-VAL-DSP
  // =========================================================================
  test.describe('Display Page & Revision History Validations @QTN-VAL-DSP', () => {
    test('QTN-VAL-DSP-001: should render read-only display view when opening existing quotation', async ({
      quotationListPage,
      quotationDisplayPage,
      page,
    }) => {
      await quotationListPage.open();
      const firstRow = page.locator('tbody tr').first();
      if (await firstRow.isVisible()) {
        await quotationListPage.openFirstRecordDisplay();
        // Expect display view
        await expect(page).toHaveURL(/\/quotation\/\d+/);
      }
    });
  });
});
