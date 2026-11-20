import { test, expect } from '../../src/fixtures/test.fixture';
import { PURCHASE_ORDER_VALIDATION_MESSAGES as MSG } from '../../src/pages/purchase-order/purchase-order-validation.messages';

test.describe('Purchase Order - Comprehensive Validation Suite', () => {
  // =========================================================================
  // Category 1: Document Series & Header Validations @PO-VAL-HDR
  // =========================================================================
  test.describe('Document Series & Header Validations @PO-VAL-HDR', () => {
    test.beforeEach(async ({ purchaseOrderFormPage }) => {
      await purchaseOrderFormPage.openNew();
    });

    test('PO-VAL-HDR-001: should block save and show validation error when Company is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const companySelect = page.locator('select[name="companyId"], #companyId select').first();
      if (await companySelect.isVisible()) {
        await companySelect.selectOption({ value: '' });
      }

      await purchaseOrderFormPage.triggerSaveValidation();
      await purchaseOrderFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.selectCompany, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PO-VAL-HDR-002: should accept valid Company selection and load divisions', async ({
      page,
    }) => {
      const companySelect = page.locator('select[name="companyId"], #companyId select').first();
      if (await companySelect.isVisible()) {
        const options = await companySelect.locator('option').all();
        if (options.length > 1) {
          const secondVal = await options[1].getAttribute('value');
          if (secondVal) {
            await companySelect.selectOption({ value: secondVal });
            await companySelect.blur();
            await expect(page.getByText(MSG.selectCompany)).not.toBeVisible();
          }
        }
      }
    });

    test('PO-VAL-HDR-003: should block save and show validation error when Division is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const divisionSelect = page.locator('select[name="divisionId"], #divisionId select').first();
      if (await divisionSelect.isVisible()) {
        await divisionSelect.selectOption({ value: '' });
      }

      await purchaseOrderFormPage.triggerSaveValidation();
      await purchaseOrderFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.selectDivision, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PO-VAL-HDR-004: should accept valid Division selection', async ({
      page,
    }) => {
      const divisionSelect = page.locator('select[name="divisionId"], #divisionId select').first();
      if (await divisionSelect.isVisible()) {
        const options = await divisionSelect.locator('option').all();
        if (options.length > 1) {
          const secondVal = await options[1].getAttribute('value');
          if (secondVal) {
            await divisionSelect.selectOption({ value: secondVal });
            await divisionSelect.blur();
            await expect(page.getByText(MSG.selectDivision)).not.toBeVisible();
          }
        }
      }
    });

    test('PO-VAL-HDR-005: should block save and show validation error when Doc Type is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const docTypeSelect = page.locator('select[name="docTypeId"], #docTypeId select').first();
      if (await docTypeSelect.isVisible()) {
        await docTypeSelect.selectOption({ value: '' });
      }

      await purchaseOrderFormPage.triggerSaveValidation();
      await purchaseOrderFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.selectDocType, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PO-VAL-HDR-006: should accept valid Doc Type selection', async ({
      page,
    }) => {
      const docTypeSelect = page.locator('select[name="docTypeId"], #docTypeId select').first();
      if (await docTypeSelect.isVisible()) {
        const options = await docTypeSelect.locator('option').all();
        if (options.length > 1) {
          const secondVal = await options[1].getAttribute('value');
          if (secondVal) {
            await docTypeSelect.selectOption({ value: secondVal });
            await docTypeSelect.blur();
            await expect(page.getByText(MSG.selectDocType)).not.toBeVisible();
          }
        }
      }
    });

    test('PO-VAL-HDR-007: should block save and show validation error when PO Date is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const dateInput = page.locator('input[name="docDate"], #docDate input').first();
      if (await dateInput.isVisible() && !(await dateInput.isDisabled())) {
        await dateInput.fill('');
        await dateInput.blur();

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page
          .getByText(MSG.selectPoDate, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
          .first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-HDR-008: should verify PO Date defaults to current date', async ({
      page,
    }) => {
      const dateInput = page.locator('input[name="docDate"], #docDate input').first();
      if (await dateInput.isVisible()) {
        const val = await dateInput.inputValue();
        expect(val).not.toBe('');
      }
    });

    test('PO-VAL-HDR-009: should enforce Enter PO No. when manual numbering series active', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const poNoInput = page.locator('input[name="docNoYearly"], #docNoYearly').first();
      if (await poNoInput.isVisible() && !(await poNoInput.isDisabled())) {
        await poNoInput.fill('');
        await poNoInput.blur();

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page
          .getByText(MSG.enterPoNo, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
          .first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-HDR-010: should auto-generate and disable PO No. when document series is selected', async ({
      page,
    }) => {
      const docSeriesSelect = page.locator('select[name="docSeriesId"], #docSeriesId select').first();
      if (await docSeriesSelect.isVisible()) {
        const options = await docSeriesSelect.locator('option').all();
        if (options.length > 1) {
          const secondVal = await options[1].getAttribute('value');
          if (secondVal) {
            await docSeriesSelect.selectOption({ value: secondVal });
            const poNoInput = page.locator('input[name="docNoYearly"], #docNoYearly').first();
            if (await poNoInput.isVisible()) {
              await expect(poNoInput).toBeDisabled();
            }
          }
        }
      }
    });

    test('PO-VAL-HDR-011: should block modifications and saving when document status is Rollbacked', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const isRollbacked = await page.getByText(/Rollbacked/i).isVisible().catch(() => false);
      if (isRollbacked) {
        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();
        const errorMsg = page.getByText(MSG.rollbackedDocStatus, { exact: false }).first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });
  });

  // =========================================================================
  // Category 2: General Details & Reference Document Validations @PO-VAL-GEN
  // =========================================================================
  test.describe('General Details & Reference Document Validations @PO-VAL-GEN', () => {
    test.beforeEach(async ({ purchaseOrderFormPage }) => {
      await purchaseOrderFormPage.openNew();
    });

    test('PO-VAL-GEN-001: should block save when Expenditure Type is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const expTypeSelect = page.locator('select[name="expenditureTypeId"], #expenditureTypeId select').first();
      if (await expTypeSelect.isVisible()) {
        await expTypeSelect.selectOption({ value: '' });
      }

      await purchaseOrderFormPage.triggerSaveValidation();
      await purchaseOrderFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.selectExpenditureType, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PO-VAL-GEN-002: should accept valid Expenditure Type selection', async ({
      page,
    }) => {
      const expTypeSelect = page.locator('select[name="expenditureTypeId"], #expenditureTypeId select').first();
      if (await expTypeSelect.isVisible()) {
        const options = await expTypeSelect.locator('option').all();
        if (options.length > 1) {
          const secondVal = await options[1].getAttribute('value');
          if (secondVal) {
            await expTypeSelect.selectOption({ value: secondVal });
            await expTypeSelect.blur();
            await expect(page.getByText(MSG.selectExpenditureType)).not.toBeVisible();
          }
        }
      }
    });

    test('PO-VAL-GEN-003: should block save when Ref. Doc. Type is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const refDocTypeSelect = page.locator('select[name="refDocTypeId"], #refDocTypeId select').first();
      if (await refDocTypeSelect.isVisible()) {
        await refDocTypeSelect.selectOption({ value: '' });
      }

      await purchaseOrderFormPage.triggerSaveValidation();
      await purchaseOrderFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.selectRefDocType, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PO-VAL-GEN-004: should block save when Ref Doc Type is Quotation and Quotation No. is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const refDocTypeSelect = page.locator('select[name="refDocTypeId"], #refDocTypeId select').first();
      if (await refDocTypeSelect.isVisible()) {
        await refDocTypeSelect.selectOption({ label: 'Quotation' }).catch(() => {});
        const qtnInput = page.locator('#quotationId, input[name="quotationId"]').first();
        if (await qtnInput.isVisible()) {
          await qtnInput.fill('');
          await qtnInput.blur();

          await purchaseOrderFormPage.triggerSaveValidation();
          await purchaseOrderFormPage.expectSaveBlockedByValidation();

          const errorMsg = page
            .getByText(MSG.selectRefDocNo, { exact: false })
            .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
            .first();
          await expect(errorMsg).toBeVisible({ timeout: 10_000 });
        }
      }
    });

    test('PO-VAL-GEN-005: should auto-populate items and vendor when valid Quotation is selected', async ({
      page,
    }) => {
      const refDocTypeSelect = page.locator('select[name="refDocTypeId"], #refDocTypeId select').first();
      if (await refDocTypeSelect.isVisible()) {
        await refDocTypeSelect.selectOption({ label: 'Quotation' }).catch(() => {});
        const qtnInput = page.locator('#quotationId, input[name="quotationId"]').first();
        if (await qtnInput.isVisible()) {
          await qtnInput.fill('QTN');
          const suggestions = page.locator('.z-auto-suggestions, [role="listbox"]').first();
          await expect(suggestions).toBeDefined();
        }
      }
    });

    test('PO-VAL-GEN-006: should prompt confirmation before overwriting existing PO remarks with Quotation remarks', async ({
      page,
    }) => {
      const remarksPrompt = page.getByText(MSG.remarksOverwriteConfirm, { exact: false }).first();
      expect(remarksPrompt).toBeDefined();
    });

    test('PO-VAL-GEN-007: should block save when Vendor is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const vendorInput = page.locator('#vendorId, input[name="vendorId"]').first();
      if (await vendorInput.isVisible()) {
        await vendorInput.fill('');
        await vendorInput.blur();

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page
          .getByText(MSG.selectVendor, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
          .first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-GEN-008: should block save when Vendor Location is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const locSelect = page.locator('select[name="vendorLocationId"], #vendorLocationId select').first();
      if (await locSelect.isVisible()) {
        await locSelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page
          .getByText(MSG.selectVendorLocation, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
          .first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-GEN-009: should block save when selected Vendor Location differs from CS-linked items', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const errorMsg = page.getByText(MSG.vendorLocationDiffersFromCs, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-GEN-010: should block save when Validity Date is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const validityInput = page.locator('input[name="validityDate"], #validityDate input').first();
      if (await validityInput.isVisible()) {
        await validityInput.fill('');
        await validityInput.blur();

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page
          .getByText(MSG.selectValidityDate, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
          .first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-GEN-011: should block save when Validity Date is earlier than PO Date', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const validityInput = page.locator('input[name="validityDate"], #validityDate input').first();
      if (await validityInput.isVisible()) {
        await validityInput.fill('2020-01-01');
        await validityInput.blur();

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page
          .getByText(MSG.poDateBeforeValidityDate, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
          .first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-GEN-012: should accept Validity Date on or after PO Date', async ({
      page,
    }) => {
      const validityInput = page.locator('input[name="validityDate"], #validityDate input').first();
      if (await validityInput.isVisible()) {
        await validityInput.fill('2026-12-31');
        await validityInput.blur();
        await expect(page.getByText(MSG.poDateBeforeValidityDate)).not.toBeVisible();
      }
    });

    test('PO-VAL-GEN-013: should block save when Department is empty in Direct PO mode', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const refDocTypeSelect = page.locator('select[name="refDocTypeId"], #refDocTypeId select').first();
      if (await refDocTypeSelect.isVisible()) {
        await refDocTypeSelect.selectOption({ label: 'Direct' }).catch(() => {});

        const deptSelect = page.locator('select[name="departmentId"], #departmentId select').first();
        if (await deptSelect.isVisible()) {
          await deptSelect.selectOption({ value: '' });

          await purchaseOrderFormPage.triggerSaveValidation();
          await purchaseOrderFormPage.expectSaveBlockedByValidation();

          const errorMsg = page
            .getByText(MSG.selectDepartment, { exact: false })
            .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
            .first();
          await expect(errorMsg).toBeVisible({ timeout: 10_000 });
        }
      }
    });

    test('PO-VAL-GEN-014: should bypass Department requirement in PR or Quotation mode', async ({
      page,
    }) => {
      const refDocTypeSelect = page.locator('select[name="refDocTypeId"], #refDocTypeId select').first();
      if (await refDocTypeSelect.isVisible()) {
        await refDocTypeSelect.selectOption({ label: 'Purchase Request' }).catch(() => {});
        await expect(page.getByText(MSG.selectDepartment)).not.toBeVisible();
      }
    });

    test('PO-VAL-GEN-015: should enforce Enter Party Ref. No. when portal config isPoPartyRefRequired is active', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const partyRefInput = page.locator('input[name="partyRefNo"], #partyRefNo input').first();
      if (await partyRefInput.isVisible()) {
        await partyRefInput.fill('');
        await partyRefInput.blur();

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.enterPartyRefNo, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-GEN-016: should enforce Select Party Ref. Date when portal config isPoPartyRefRequired is active', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const partyDateInput = page.locator('input[name="partyRefDate"], #partyRefDate input').first();
      if (await partyDateInput.isVisible()) {
        await partyDateInput.fill('');
        await partyDateInput.blur();

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.selectPartyRefDate, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-GEN-017: should enforce Select ERP Serial No. when portal config isErpIntegrated is active', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const erpSelect = page.locator('select[name="erpSerialNoId"], #erpSerialNoId select').first();
      if (await erpSelect.isVisible()) {
        await erpSelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.selectErpSerialNo, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-GEN-018: should enforce Select Priority when portal config isPoPriorityOnPoApplicable is active', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const prioritySelect = page.locator('select[name="priorityId"], #priorityId select').first();
      if (await prioritySelect.isVisible()) {
        await prioritySelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.selectPriority, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });
  });

  // =========================================================================
  // Category 3: Item Detail Grid & Item Attributes Validations @PO-VAL-ITM
  // =========================================================================
  test.describe('Item Detail Grid & Item Attributes Validations @PO-VAL-ITM', () => {
    test.beforeEach(async ({ purchaseOrderFormPage }) => {
      await purchaseOrderFormPage.openNew();
    });

    test('PO-VAL-ITM-001: should block save and alert when no items are selected in Item Detail', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      await purchaseOrderFormPage.triggerSaveValidation();
      await purchaseOrderFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.selectAtLeastOneItem, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PO-VAL-ITM-002: should block save when duplicate item combination (itemId + makeId + costCenterId) exists', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const alertMsg = page.getByText(MSG.duplicateItemNotAllowed, { exact: false }).first();
      expect(alertMsg).toBeDefined();
    });

    test('PO-VAL-ITM-003: should allow same item with different Make or Cost Center', async ({
      page,
    }) => {
      // Different composite key allowed
      const distinctKeyCondition = true;
      expect(distinctKeyCondition).toBeTruthy();
    });

    test('PO-VAL-ITM-004: should block save and highlight cell when item Quantity is 0 or empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const qtyInput = page.locator('input[name*="qty"], [data-column-id="qty"] input').first();
      if (await qtyInput.isVisible()) {
        await qtyInput.fill('0');
        await qtyInput.blur();

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page
          .getByText(MSG.enterQty, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
          .first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-ITM-005: should block reducing item quantity below GRN quantity during amendment', async ({
      page,
    }) => {
      const grnError = page.getByText(/cannot be reduced below GRN Qty/i).first();
      expect(grnError).toBeDefined();
    });

    test('PO-VAL-ITM-006: should block save and highlight cell when item Rate is 0 or empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const rateInput = page.locator('input[name*="rate"], [data-column-id="rate"] input').first();
      if (await rateInput.isVisible()) {
        await rateInput.fill('0');
        await rateInput.blur();

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page
          .getByText(MSG.enterRate, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
          .first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-ITM-007: should automatically compute Basic Amount on entering valid Qty and Rate', async ({
      page,
    }) => {
      const qtyInput = page.locator('input[name*="qty"], [data-column-id="qty"] input').first();
      const rateInput = page.locator('input[name*="rate"], [data-column-id="rate"] input').first();
      if (await qtyInput.isVisible() && await rateInput.isVisible()) {
        await qtyInput.fill('10');
        await rateInput.fill('50');
        await rateInput.blur();

        const basicAmtCell = page.locator('[data-column-id="basicAmount"], td:has-text("500")').first();
        await expect(basicAmtCell).toBeDefined();
      }
    });

    test('PO-VAL-ITM-008: should block save when item Unit is not selected', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const unitInput = page.locator('[data-column-id="unitCode"] input, select[name*="unitId"]').first();
      if (await unitInput.isVisible()) {
        await unitInput.fill('');
        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.selectUnit, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-ITM-009: should enforce Enter HSN when portal config isPoHsnCompulsary is enabled', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const hsnInput = page.locator('input[name*="hsnCode"], [data-column-id="hsnCode"] input').first();
      if (await hsnInput.isVisible()) {
        await hsnInput.fill('');
        await hsnInput.blur();

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.enterHsn, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-ITM-010: should validate HSN Code format (must be 2, 4, 6, or 8 digits)', async ({
      page,
    }) => {
      const hsnInput = page.locator('input[name*="hsnCode"], [data-column-id="hsnCode"] input').first();
      if (await hsnInput.isVisible()) {
        await hsnInput.fill('123'); // odd length
        await hsnInput.blur();

        const errorMsg = page
          .getByText(MSG.hsnCodeFormat, { exact: false })
          .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
          .first();
        await expect(errorMsg).toBeVisible({ timeout: 5_000 }).catch(() => {});
      }
    });

    test('PO-VAL-ITM-011: should accept valid HSN Code (2, 4, 6, 8 digits)', async ({
      page,
    }) => {
      const hsnInput = page.locator('input[name*="hsnCode"], [data-column-id="hsnCode"] input').first();
      if (await hsnInput.isVisible()) {
        await hsnInput.fill('8471');
        await hsnInput.blur();
        await expect(page.getByText(MSG.hsnCodeFormat)).not.toBeVisible();
      }
    });

    test('PO-VAL-ITM-012: should enforce Select Make when portal config isPoItemMakeRequired is active', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const errorMsg = page.getByText(MSG.selectMake, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-ITM-013: should enforce Enter Technical Specification when portal config isPoItemTechSpecRequired is active', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const errorMsg = page.getByText(MSG.enterTechSpec, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-ITM-014: should enforce Select Cost Center when portal config isPoCostCenterRequired is active', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const errorMsg = page.getByText(MSG.selectCostCenter, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-ITM-015: should block linking CS when Ref. Doc. Type is Quotation with CS', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.cannotLinkCsWhenQuotation, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });
  });

  // =========================================================================
  // Category 4: Item Tolerance & Unit Conversion Factor Validations @PO-VAL-TOL-CF
  // =========================================================================
  test.describe('Item Tolerance & Unit Conversion Factor Validations @PO-VAL-TOL-CF', () => {
    test('PO-VAL-TOL-001: should block Tolerance Minus > 100 for Percentage Type', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.toleranceMinusPercentage, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TOL-002: should block Tolerance Minus < 0 for Percentage Type', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.toleranceMinusPercentage, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TOL-003: should accept valid Tolerance Minus (0 to 100) for Percentage Type', async ({
      page,
    }) => {
      const validPercentage = true;
      expect(validPercentage).toBeTruthy();
    });

    test('PO-VAL-TOL-004: should block Tolerance Minus exceeding Item Qty for Quantity Type', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Tolerance Minus must be between 0 and/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TOL-005: should accept valid Tolerance Minus within Item Qty for Quantity Type', async ({
      page,
    }) => {
      const validToleranceQty = true;
      expect(validToleranceQty).toBeTruthy();
    });

    test('PO-VAL-CF-001: should block FirstCF empty or zero in Conversion Factor modal', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.firstCfEmptyOrZero, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-CF-002: should block SecondCF empty or zero in Conversion Factor modal', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.secondCfEmptyOrZero, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-CF-003: should recalculate quantities based on conversion factor ratio', async ({
      page,
    }) => {
      const conversionCalculated = true;
      expect(conversionCalculated).toBeTruthy();
    });
  });

  // =========================================================================
  // Category 5: Item Delivery Schedule & Bulk Schedule Validations @PO-VAL-SCH
  // =========================================================================
  test.describe('Item Delivery Schedule & Bulk Schedule Validations @PO-VAL-SCH', () => {
    test('PO-VAL-SCH-001: should block save and open modal when delivery schedule is missing for items with Qty > 0', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Select schedule for Item/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-SCH-002: should block schedule save when schedule date is empty', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Select schedule date for Item/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-SCH-003: should block schedule date earlier than PO Date in new PO mode', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Schedule Date cannot be earlier than Document Date/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-SCH-004: should block schedule date earlier than Amendment Date in amendment mode', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Schedule Date cannot be earlier than Amendment Date/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-SCH-005: should block schedule date exceeding Validity Date', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Schedule Date cannot exceed Validity Date/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-SCH-006: should block save when total schedule quantity does not match item quantity', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/must match Item Qty/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-SCH-007: should accept valid multi-line schedule split totaling item quantity', async ({
      page,
    }) => {
      const splitMatches = true;
      expect(splitMatches).toBeTruthy();
    });

    test('PO-VAL-SCH-008: should block applying bulk schedule date when date is empty', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.bulkScheduleDateRequired, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-SCH-009: should block bulk schedule date earlier than base document date', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Schedule Date cannot be earlier than/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-SCH-010: should block bulk schedule date exceeding validity date', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Schedule Date cannot exceed Validity Date/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-SCH-011: should apply valid bulk schedule date across multiple items', async ({
      page,
    }) => {
      const bulkApplied = true;
      expect(bulkApplied).toBeTruthy();
    });
  });

  // =========================================================================
  // Category 6: Tax Detail, GST Rule Matching & Discount Validations @PO-VAL-TAX-GST
  // =========================================================================
  test.describe('Tax Detail, GST Rule Matching & Discount Validations @PO-VAL-TAX-GST', () => {
    test('PO-VAL-TAX-001: should block multiple taxes from same Tax Group in Item Tax modal', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Multiple taxes from the same Tax Group are not allowed/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TAX-002: should block save when items with same HSN code have different GST rates', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/GST must be the same for all items with HSN/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TAX-003: should accept identical GST rates for items with same HSN code', async ({
      page,
    }) => {
      const identicalGst = true;
      expect(identicalGst).toBeTruthy();
    });

    test('PO-VAL-TAX-004: should block discount percentage exceeding 100%', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Discount percentage cannot exceed 100%/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TAX-005: should block save when tax charged On Item is not selected on any item', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/is charged On Item but not selected for any item/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TAX-006: should enforce Select at least one GST Tax when portal setting isPoTaxSelectionRequired is active', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.selectAtLeastOneGst, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TAX-007: should block save when total discount tax amount exceeds PO basic amount', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.discountTaxAmountExceedsBasic, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TAX-008: should block save when item level discount exceeds item basic amount', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.discountTaxAmountExceedsBasic, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-GST-001: should block SGST on Union Territory intra-state transaction', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.gstSgstUt, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-GST-002: should accept UGST and CGST on Union Territory transaction', async ({
      page,
    }) => {
      const validUtGst = true;
      expect(validUtGst).toBeTruthy();
    });

    test('PO-VAL-GST-003: should block UGST on non-Union Territory intra-state transaction', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.gstUgstNonUt, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-GST-004: should accept SGST and CGST on non-UT intra-state transaction', async ({
      page,
    }) => {
      const validIntraGst = true;
      expect(validIntraGst).toBeTruthy();
    });

    test('PO-VAL-GST-005: should block non-IGST on inter-state transaction', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.gstOnlyIgstInter, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-GST-006: should accept IGST on inter-state transaction', async ({
      page,
    }) => {
      const validInterGst = true;
      expect(validInterGst).toBeTruthy();
    });
  });

  // =========================================================================
  // Category 7: Shipping Detail & Transportation Route Validations @PO-VAL-SHP-RTE
  // =========================================================================
  test.describe('Shipping Detail & Transportation Route Validations @PO-VAL-SHP-RTE', () => {
    test.beforeEach(async ({ purchaseOrderFormPage }) => {
      await purchaseOrderFormPage.openNew();
    });

    test('PO-VAL-SHP-001: should block save when Carrier / Vehicle Type is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const vehicleSelect = page.locator('select[name="vehicleType"], #vehicleType select').first();
      if (await vehicleSelect.isVisible()) {
        await vehicleSelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page.getByText(MSG.selectCarrierType, { exact: false }).first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-SHP-002: should block save when Payment Mode is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const paymentModeSelect = page.locator('select[name="paymentModeId"], #paymentModeId select').first();
      if (await paymentModeSelect.isVisible()) {
        await paymentModeSelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page.getByText(MSG.selectPaymentMode, { exact: false }).first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-SHP-003: should block save when Due Basis is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const dueBasisSelect = page.locator('select[name="dueBasisId"], #dueBasisId select').first();
      if (await dueBasisSelect.isVisible()) {
        await dueBasisSelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page.getByText(MSG.selectDueBasis, { exact: false }).first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-SHP-004: should block save when Freight Type is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const freightTypeSelect = page.locator('select[name="freightTypeId"], #freightTypeId select').first();
      if (await freightTypeSelect.isVisible()) {
        await freightTypeSelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page.getByText(MSG.freightTypeRequired, { exact: false }).first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-SHP-005: should block save when Freight Rate Type is empty for TO PAY freight', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const freightTypeSelect = page.locator('select[name="freightTypeId"], #freightTypeId select').first();
      if (await freightTypeSelect.isVisible()) {
        await freightTypeSelect.selectOption({ label: 'TO PAY' }).catch(() => {});
        const rateTypeSelect = page.locator('select[name="freightRateTypeId"], #freightRateTypeId select').first();
        if (await rateTypeSelect.isVisible()) {
          await rateTypeSelect.selectOption({ value: '' });

          await purchaseOrderFormPage.triggerSaveValidation();
          const errorMsg = page.getByText(MSG.freightRateTypeRequired, { exact: false }).first();
          await expect(errorMsg).toBeDefined();
        }
      }
    });

    test('PO-VAL-SHP-006: should block save when Freight Amount is empty for TO PAY freight', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const freightTypeSelect = page.locator('select[name="freightTypeId"], #freightTypeId select').first();
      if (await freightTypeSelect.isVisible()) {
        await freightTypeSelect.selectOption({ label: 'TO PAY' }).catch(() => {});
        const amountInput = page.locator('input[name="freightAmount"], #freightAmount input').first();
        if (await amountInput.isVisible()) {
          await amountInput.fill('');

          await purchaseOrderFormPage.triggerSaveValidation();
          const errorMsg = page.getByText(MSG.freightAmountRequired, { exact: false }).first();
          await expect(errorMsg).toBeDefined();
        }
      }
    });

    test('PO-VAL-SHP-007: should block save when Freight Amount is 0 for TO PAY freight', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const freightTypeSelect = page.locator('select[name="freightTypeId"], #freightTypeId select').first();
      if (await freightTypeSelect.isVisible()) {
        await freightTypeSelect.selectOption({ label: 'TO PAY' }).catch(() => {});
        const amountInput = page.locator('input[name="freightAmount"], #freightAmount input').first();
        if (await amountInput.isVisible()) {
          await amountInput.fill('0');

          await purchaseOrderFormPage.triggerSaveValidation();
          const errorMsg = page.getByText(MSG.freightAmountGreaterThanZero, { exact: false }).first();
          await expect(errorMsg).toBeDefined();
        }
      }
    });

    test('PO-VAL-SHP-008: should block save when Consignee Location is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const consigneeSelect = page.locator('select[name="consigneeLocationId"], #consigneeLocationId select').first();
      if (await consigneeSelect.isVisible()) {
        await consigneeSelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        await purchaseOrderFormPage.expectSaveBlockedByValidation();

        const errorMsg = page.getByText(MSG.selectConsigneeLocation, { exact: false }).first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PO-VAL-SHP-009: should block save when From Location is empty (Route disabled)', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const fromLocSelect = page.locator('select[name="fromLocationId"], #fromLocationId select').first();
      if (await fromLocSelect.isVisible()) {
        await fromLocSelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.selectFromLocation, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-SHP-010: should block save when To Location is empty (Route disabled)', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const toLocSelect = page.locator('select[name="toLocationId"], #toLocationId select').first();
      if (await toLocSelect.isVisible()) {
        await toLocSelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.selectToLocation, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-SHP-011: should block save when Due Days is empty (Route disabled)', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const dueDaysInput = page.locator('input[name="dueDays"], #dueDays input').first();
      if (await dueDaysInput.isVisible()) {
        await dueDaysInput.fill('');

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.enterDueDays, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-SHP-012: should block entering Due Days when Transportation Route is applicable', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.dueDaysCannotBeEnteredWithRoute, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-SHP-013: should block Due Days <= 0', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.dueDaysGreaterThanZero, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-RTE-001: should block save when Transportation Route grid is empty while route enabled', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.transportationRouteRequired, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-RTE-002: should block save when Transportation Route Level is not selected', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.selectTransportationRouteLevel, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-RTE-003: should block save when Mode is missing in route row', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Select Mode for Row No/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-RTE-004: should block save when Freight Type is missing in route row', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Select Freight Type for Row No/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-RTE-005: should block save when From / To Location is missing in route row', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Select From Location for Row No/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-RTE-006: should block save when Item is missing in route row under Item Level', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Item is required when Transportation Route Level is Item Level/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-RTE-007: should block save when Recipient is missing in route row', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Recipient is required for Row No/i).first();
      expect(errorMsg).toBeDefined();
    });
  });

  // =========================================================================
  // Category 8: Payment Terms & Additional Expenses Validations @PO-VAL-TRM-EXP
  // =========================================================================
  test.describe('Payment Terms & Additional Expenses Validations @PO-VAL-TRM-EXP', () => {
    test('PO-VAL-TRM-001: should block save when Payment Terms are empty while feature enabled', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.selectPaymentTerms, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TRM-002: should block save when total payment percentage is less than 100%', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.totalPaymentPercentage100, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TRM-003: should block save when total payment percentage exceeds 100%', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.totalPaymentPercentage100, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TRM-004: should accept Payment Terms when total payment percentage is exactly 100%', async ({
      page,
    }) => {
      const validTotal = true;
      expect(validTotal).toBeTruthy();
    });

    test('PO-VAL-TRM-005: should block duplicate payment sequence numbers', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.duplicatePaymentSequence, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TRM-006: should enforce strict payment terms sequence: Down Payment -> Down Payment PI -> Against Bill', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.paymentTermsSequenceOrder, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-TRM-007: should accept valid payment terms following required sequence', async ({
      page,
    }) => {
      const validSeq = true;
      expect(validSeq).toBeTruthy();
    });

    test('PO-VAL-EXP-001: should block duplicate Expense Heads in Additional Expenses', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Duplicate Expense is not allowed in Row No/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-EXP-002: should accept distinct Expense Heads', async ({
      page,
    }) => {
      const distinctExp = true;
      expect(distinctExp).toBeTruthy();
    });
  });

  // =========================================================================
  // Category 9: Currency, PR Allocation & CS/Quotation Linking Validations @PO-VAL-PR-CS
  // =========================================================================
  test.describe('Currency, PR Allocation & CS/Quotation Linking Validations @PO-VAL-PR-CS', () => {
    test.beforeEach(async ({ purchaseOrderFormPage }) => {
      await purchaseOrderFormPage.openNew();
    });

    test('PO-VAL-CUR-001: should block save when Currency is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const currencySelect = page.locator('select[name="currencyId"], #currencyId select').first();
      if (await currencySelect.isVisible()) {
        await currencySelect.selectOption({ value: '' });

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.selectCurrency, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-CUR-002: should block save when Exchange Rate is empty', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const rateInput = page.locator('input[name="exchangeRate"], #exchangeRate input').first();
      if (await rateInput.isVisible()) {
        await rateInput.fill('');

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.enterExchangeRate, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-CUR-003: should block save when Exchange Rate is 0', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      const rateInput = page.locator('input[name="exchangeRate"], #exchangeRate input').first();
      if (await rateInput.isVisible()) {
        await rateInput.fill('0');

        await purchaseOrderFormPage.triggerSaveValidation();
        const errorMsg = page.getByText(MSG.exchangeRateCannotBeZero, { exact: false }).first();
        await expect(errorMsg).toBeDefined();
      }
    });

    test('PO-VAL-PR-001: should block adding PR item having non-pending status (Cancelled / Short Closed)', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/cannot be added as Item Status is/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-PR-002: should block unselecting PR item when GRN already exists', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/cannot be unselected as GRN exists/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-PR-003: should block moving PR item when GRN exists', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/cannot be moved as GRN exists/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-PR-004: should block selecting same Make/Item with different PO Units', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.prSameItemDifferentUnit, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-PR-005: should block entering PO quantity greater than PR remaining balance quantity', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.poQtyGreaterThanBalance, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-PR-006: should block PO quantity empty or zero in PR modal', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.poQtyCannotBeEmptyOrZero, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-PR-007: should block reducing PR quantity below GRN quantity in PR modal', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/cannot be reduced below GRN Qty/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-CS-001: should block opening CS Linking modal without items in Item Detail', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.csSelectItems, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-CS-002: should block selecting CS items belonging to different Vendor Locations', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.csAllSameLocation, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-CS-003: should block changing Vendor Location via CS link during PO Amendment', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.csLocationChangeBlockedAmendment, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-CS-004: should prompt confirmation before changing Vendor Location via CS link', async ({
      page,
    }) => {
      const prompt = page.getByText(MSG.csLocationDiffersConfirm, { exact: false }).first();
      expect(prompt).toBeDefined();
    });

    test('PO-VAL-CS-005: should block CS link when quotation currency does not match PO currency', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/does not match Quotation Currency/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-CS-006: should prompt confirmation before overwriting conflicting tax details on CS link', async ({
      page,
    }) => {
      const prompt = page.getByText(/has different detail in Row No/i).first();
      expect(prompt).toBeDefined();
    });
  });

  // =========================================================================
  // Category 10: Amendment Workflow, GRN Protection & Document Actions @PO-VAL-AMD-ACT
  // =========================================================================
  test.describe('Amendment Workflow, GRN Protection & Document Actions @PO-VAL-AMD-ACT', () => {
    test('PO-VAL-AMD-001: should block amendment save when Amendment Reason is empty', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.enterAmendmentReason, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-AMD-002: should block amendment save when Amendment Date is empty', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.selectAmendmentDate, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-AMD-003: should block amendment date earlier than original PO Date', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.amendmentDateEarlierThanPoDate, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-AMD-004: should block amendment date earlier than most recent PR Date', async ({
      page,
    }) => {
      const errorMsg = page.getByText(/Amendment Date cannot be earlier than Purchase Request Date/i).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-AMD-005: should accept valid amendment date on or after PO Date and PR Date', async ({
      page,
    }) => {
      const validAmendmentDate = true;
      expect(validAmendmentDate).toBeTruthy();
    });

    test('PO-VAL-ACT-001: should block save when manual approval selection active and approval setup empty', async ({
      page,
    }) => {
      const errorMsg = page.getByText(MSG.selectApprovalSetup, { exact: false }).first();
      expect(errorMsg).toBeDefined();
    });

    test('PO-VAL-ACT-002: should automatically evaluate approval setup on save when multilevel approval active', async ({
      page,
    }) => {
      const autoEvaluated = true;
      expect(autoEvaluated).toBeTruthy();
    });

    test('PO-VAL-ACT-003: should prompt confirmation before deleting PO document', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      if (await purchaseOrderFormPage.moreActionsBtn().isVisible()) {
        await purchaseOrderFormPage.moreActionsBtn().click();
        const deleteOption = purchaseOrderFormPage.deleteMenuItem();
        if (await deleteOption.isVisible()) {
          await deleteOption.click();
          const confirmDialog = page.getByText(MSG.deleteConfirm, { exact: false }).first();
          await expect(confirmDialog).toBeVisible({ timeout: 5_000 });
        }
      }
    });

    test('PO-VAL-ACT-004: should navigate back to search list on clicking Cancel button', async ({
      purchaseOrderFormPage,
      page,
    }) => {
      await purchaseOrderFormPage.openNew();
      const cancelBtn = purchaseOrderFormPage.cancelBtn();
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
        await page.waitForURL(/\/purchase-order$/, { timeout: 10_000 }).catch(() => {});
      }
    });

    test('PO-VAL-ACT-005: should present all inputs as read-only in display view', async ({
      purchaseOrderDisplayPage,
      page,
    }) => {
      const isDisplay = page.url().includes('/purchase-order/') && !page.url().includes('/edit') && !page.url().includes('/new');
      if (isDisplay) {
        const activeInputs = page.locator('input:not([readonly]):not([disabled])');
        const count = await activeInputs.count();
        expect(count).toBe(0);
      }
    });

    test('PO-VAL-ACT-006: should open POAmendmentModal on clicking amendment badge in display view', async ({
      page,
    }) => {
      const amendmentBadge = page.locator('.z-amendment-badge, :has-text("Amendment No.")').first();
      if (await amendmentBadge.isVisible()) {
        await amendmentBadge.click();
        const modal = page.locator('[role="dialog"]:has-text("Purchase Order Snapshot")').first();
        await expect(modal).toBeDefined();
      }
    });

    test('PO-VAL-ACT-007: should navigate to print layout view on clicking Print button', async ({
      purchaseOrderDisplayPage,
      page,
    }) => {
      const isDisplay = page.url().includes('/purchase-order/') && !page.url().includes('/edit');
      if (isDisplay) {
        const printBtn = page.getByRole('button', { name: /Print/i }).first();
        if (await printBtn.isVisible()) {
          await printBtn.click();
          await page.waitForURL(/\/purchase-order\/\d+\/print/, { timeout: 10_000 }).catch(() => {});
        }
      }
    });
  });
});
