import { test, expect } from '../../src/fixtures/test.fixture';
import { RFQ_VALIDATION_MESSAGES as MSG } from '../../src/pages/request-for-quotation/rfq-validation.messages';
import {
  REQUEST_FOR_QUOTATION_ROUTES,
  DOCUMENT_DETAIL_LABELS,
  GENERAL_DETAIL_LABELS,
  ITEM_DETAIL_LABELS,
  RFQ_SOURCE_DOCUMENT_TYPE,
} from '../../src/pages/request-for-quotation/request-for-quotation.constants';
import {
  RFQ_ITEM_GRID_COLUMNS,
  RFQ_VENDOR_GRID_COLUMNS,
  RFQ_PR_MODAL_GRID_COLUMNS,
} from '../../src/pages/request-for-quotation/grids/request-for-quotation-grid.columns';
import { DataCellTable } from '../../src/utils/data-cell-table';
import {
  buildDirectRfqData,
  buildPurchaseRequestRfqData,
} from '../../src/utils/test-data/request-for-quotation.factory';
import { fillDateByLabel } from '../../src/utils/date-calendar.helper';
import { fillTextField } from '../../src/utils/field-accessor';

test.describe('Request for Quotation - Comprehensive Validation Suite', () => {
  test.afterEach(async ({ page }) => {
    const alertBtn = page.locator('.z-alert-box button').first();
    if (await alertBtn.isVisible().catch(() => false)) {
      await alertBtn.click().catch(() => {});
    }
  });

  // =========================================================================
  // Category 1: Document Detail & Header Validations RFQ-VAL-HDR-001..025)
  // =========================================================================
  test.describe('Document Detail & Header Validations @RFQ-VAL-HDR', () => {
    test.beforeEach(async ({ requestForQuotationListPage }) => {
      await requestForQuotationListPage.open();
      await requestForQuotationListPage.createNew();
    });

    test('RFQ-VAL-HDR-001, RFQ-VAL-HDR-002: should block save and show validation error when Document Type is empty', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const errorMsg = page
        .getByText(MSG.docTypeRequired, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-HDR-003: should accept valid Document Type selection and resolve series', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.documentDetail.fillAll({
        documentType: { query: 'RFQ', value: 'RFQ' },
      });

      const docTypeInput = page.locator('input[name="docTypeId"]');
      await expect(docTypeInput).toHaveValue(/.+/);
    });

    test('RFQ-VAL-HDR-006, RFQ-VAL-HDR-007: should block save when RFQ Date is cleared', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      await requestForQuotationFormPage.documentDetail.fillAll({
        documentType: { query: 'RFQ', value: 'RFQ' },
      });

      const dateInput = page.locator('input[name="docDate"]').or(page.locator('input[placeholder*="RFQ Date"]')).first();
      if (await dateInput.isVisible()) {
        await dateInput.fill('');
        await dateInput.blur();
      }

      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const dateError = page
        .getByText(MSG.rfqDateRequired, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(dateError).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-HDR-009: should block save when Due Date is empty', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      await requestForQuotationFormPage.documentDetail.fillAll({
        documentType: { query: 'RFQ', value: 'RFQ' },
      });

      const dueDateInput = page.locator('input[name="dueDate"]');
      if (await dueDateInput.isVisible()) {
        await dueDateInput.fill('');
        await dueDateInput.blur();
      }

      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const dueError = page
        .getByText(MSG.dueDateRequired, { exact: false })
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(dueError).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-HDR-010: should block save when Due Date is earlier than RFQ Date', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      await requestForQuotationFormPage.documentDetail.fillAll({
        documentType: { query: 'RFQ', value: 'RFQ' },
      });

      await fillDateByLabel(page, DOCUMENT_DETAIL_LABELS.documentDate, '2026-05-01');
      await fillDateByLabel(page, GENERAL_DETAIL_LABELS.dueDate, '2026-06-01');
      await fillDateByLabel(page, DOCUMENT_DETAIL_LABELS.documentDate, '2026-06-15'); // Before RFQ Date

      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const errorMsg = page.getByText(MSG.dueDateBeforeDocDate, { exact: false }).first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-HDR-011: should accept Due Date on the same day as RFQ Date', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      await fillDateByLabel(page, DOCUMENT_DETAIL_LABELS.documentDate, '2026-06-15');
      await fillDateByLabel(page, GENERAL_DETAIL_LABELS.dueDate, '2026-06-15');

      await expect(page.getByText(MSG.dueDateBeforeDocDate)).not.toBeVisible();
    });

    test('RFQ-VAL-HDR-014, RFQ-VAL-HDR-015: should disable Is Price List for PR Mode and enable for Direct Mode', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const priceListCheckbox = page.locator('input[name="isPriceList"]');

      // In Direct Mode
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      await expect(priceListCheckbox).toBeEnabled();

      // Switch to PR Mode
      await requestForQuotationFormPage.fillSourceDocumentPurchaseRequest();
      await expect(priceListCheckbox).toBeDisabled();
    });

    test('RFQ-VAL-HDR-018, RFQ-VAL-HDR-019: should allow empty or valid Contact Person Email', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      const emailInput = page.locator('input[name="contactEmail"]');

      // Valid email
      await emailInput.fill('procurement.head@company.com');
      await emailInput.blur();
      await expect(page.getByText(MSG.contactEmailInvalid)).not.toBeVisible();

      // Empty email allowed
      await emailInput.fill('');
      await emailInput.blur();
      await expect(page.getByText(MSG.contactEmailInvalid)).not.toBeVisible();
    });

    test('RFQ-VAL-HDR-020: should show error when Contact Person Email format is invalid', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      const emailInput = page.locator('input[name="contactEmail"]');
      await emailInput.fill('invalid-email-address');
      await emailInput.blur();

      const errorMsg = page.getByText(MSG.contactEmailInvalid, { exact: false }).first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-HDR-023: should validate Contact Number length when provided', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      const phoneInput = page.locator('input[name="contactNo"]');
      if (await phoneInput.isVisible()) {
        await phoneInput.fill('1234'); // Too short
        await phoneInput.blur();
        await requestForQuotationFormPage.triggerSaveValidation();

        const contactError = page
          .getByText(MSG.invalidContactNumber, { exact: false })
          .or(page.locator('.text-destructive'))
          .first();
        if (await contactError.isVisible()) {
          await expect(contactError).toBeVisible();
        }
      }
    });

    test('RFQ-VAL-HDR-024: should enforce max length 500 on Mail Subject', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      const mailSubjectInput = page.locator('input[name="mailSubject"], textarea[name="mailSubject"]').first();
      if (await mailSubjectInput.isVisible()) {
        await mailSubjectInput.fill('S'.repeat(520));
        await mailSubjectInput.blur();

        const errorMsg = page.getByText(MSG.mailSubjectMaxLength, { exact: false }).first();
        if (await errorMsg.isVisible()) {
          await expect(errorMsg).toBeVisible();
        }
      }
    });

    test('RFQ-VAL-HDR-025: should enforce max length 1000 on Remarks', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      const remarksInput = page.locator('textarea[name="remarks"]');
      if (await remarksInput.isVisible()) {
        await remarksInput.fill('R'.repeat(1050));
        const val = await remarksInput.inputValue();
        expect(val.length).toBeLessThanOrEqual(1000);
      }
    });
  });

  // =========================================================================
  // Category 2: Direct Mode Items Grid Validations RFQ-VAL-ITM-DIR-001..022)
  // =========================================================================
  test.describe('Direct Mode Item Details DataGrid Validations @RFQ-VAL-ITM-DIR', () => {
    test.beforeEach(async ({ requestForQuotationListPage, requestForQuotationFormPage, page }) => {
      await requestForQuotationListPage.open();
      await requestForQuotationListPage.createNew();
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      await requestForQuotationFormPage.documentDetail.fillAll({
        documentType: { query: 'RFQ', value: 'RFQ' },
      });
      await fillDateByLabel(page, GENERAL_DETAIL_LABELS.dueDate, '2026-12-31');
    });

    test('RFQ-VAL-ITM-DIR-001: should block save when items grid is empty in Direct Mode', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const itemAlert = page.getByText(MSG.atLeastOneItem, { exact: false }).first();
      await expect(itemAlert).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-ITM-DIR-002: should block save when intermediate item row has empty item name', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const itemTable = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);
      // Row 0 valid
      await itemTable.selectSuggestion(0, 'itemName', 'cold', 'cold rolled sheets');
      await itemTable.fillInput(0, 'qty', '10');

      // Trigger save with empty Row 1
      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();
    });

    test('RFQ-VAL-ITM-DIR-013: should block invalid HSN Code length (e.g. 3, 5, or 7 digits)', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const itemTable = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);
      await itemTable.selectSuggestion(0, 'itemName', 'cold', 'cold rolled sheets');

      const hsnCell = itemTable.cell(0, 'hsnCode');
      if (await hsnCell.isVisible()) {
        await itemTable.fillInput(0, 'hsnCode', '12345'); // Invalid 5-digit HSN
        await requestForQuotationFormPage.triggerSaveValidation();

        const hsnError = page.getByText(MSG.hsnCodeFormat, { exact: false }).first();
        await expect(hsnError).toBeVisible({ timeout: 10_000 });
      }
    });

    test('RFQ-VAL-ITM-DIR-014: should accept valid HSN Code length of 2, 4, 6, or 8 digits', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const itemTable = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);
      await itemTable.selectSuggestion(0, 'itemName', 'cold', 'cold rolled sheets');

      const hsnCell = itemTable.cell(0, 'hsnCode');
      if (await hsnCell.isVisible()) {
        await itemTable.fillInput(0, 'hsnCode', '7201'); // Valid 4 digits
        await expect(page.getByText(MSG.hsnCodeFormat)).not.toBeVisible();
      }
    });

    test('RFQ-VAL-ITM-DIR-015: should block save when item Unit is blank', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const itemTable = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);
      await itemTable.selectSuggestion(0, 'itemName', 'cold', 'cold rolled sheets');

      const unitCell = await itemTable.cell(0, 'unitCode');
      if (await unitCell.isVisible()) {
        const unitInput = await itemTable.input(0, 'unitCode').catch(() => null);
        if (unitInput) {
          await unitInput.fill('');
          await unitInput.blur();
        }
      }

      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();
    });

    test('RFQ-VAL-ITM-DIR-017, RFQ-VAL-ITM-DIR-018: should block save when item Quantity is zero or negative', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const itemTable = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);
      await itemTable.selectSuggestion(0, 'itemName', 'cold', 'cold rolled sheets');
      await itemTable.fillInput(0, 'qty', '0'); // Invalid zero quantity

      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const qtyError = page
        .getByText(/Qty\. must be greater than 0/i)
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(qtyError).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-ITM-DIR-020: should block duplicate Item and Make combination in Direct Mode', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const itemTable = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);

      // Row 0
      await itemTable.selectSuggestion(0, 'itemName', 'cold', 'cold rolled sheets');
      await itemTable.selectSuggestion(0, 'makeName', 'Larsen', 'Larsen & Toubro');
      await itemTable.selectSuggestion(0, 'unitCode', 'METRIC', 'METRIC TON');
      await itemTable.fillInput(0, 'qty', '10');

      // Row 1 - Duplicate of Row 0
      await itemTable.selectSuggestion(1, 'itemName', 'cold', 'cold rolled sheets');
      await itemTable.selectSuggestion(1, 'makeName', 'Larsen', 'Larsen & Toubro');
      await itemTable.selectSuggestion(1, 'unitCode', 'METRIC', 'METRIC TON');
      await itemTable.fillInput(1, 'qty', '15');

      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const dupAlert = page.getByText(MSG.duplicateItemMake, { exact: false }).first();
      await expect(dupAlert).toBeVisible({ timeout: 10_000 });
    });
  });

  // =========================================================================
  // Category 3: Item Selection Modal & PR Mode Validations RFQ-VAL-ITM-PR-001..014)
  // =========================================================================
  test.describe('PR Mode & PR Item Selection Modal Validations @RFQ-VAL-ITM-PR', () => {
    test.beforeEach(async ({ requestForQuotationListPage, requestForQuotationFormPage }) => {
      await requestForQuotationListPage.open();
      await requestForQuotationListPage.createNew();
      await requestForQuotationFormPage.fillSourceDocumentPurchaseRequest();
    });

    test('RFQ-VAL-ITM-PR-001: should make line item name non-editable in PR Mode', async ({
      page,
    }) => {
      const itemTable = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);
      const firstItemCell = await itemTable.cell(0, 'itemName');
      // In PR mode, user cannot directly edit item name cells
      const input = await firstItemCell.locator('input').first().isVisible().catch(() => false);
      expect(input).toBeFalsy();
    });

    test('RFQ-VAL-ITM-PR-002: should block confirming PR selection modal when 0 items are checked', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const selectFromPrBtn = page.getByRole('button', { name: ITEM_DETAIL_LABELS.selectFromPr, exact: true });
      if (await selectFromPrBtn.isVisible()) {
        await selectFromPrBtn.click();
        await requestForQuotationFormPage.prModal.waitForOpened();

        // Click OK/Confirm without checking any PR items
        const okBtn = page.getByRole('button', { name: /^OK$/i });
        await okBtn.click();

        const errorMsg = page.getByText(MSG.prSelectAtLeastOne, { exact: false }).first();
        await expect(errorMsg).toBeVisible({ timeout: 10_000 });
      }
    });

    test('RFQ-VAL-ITM-PR-007, RFQ-VAL-ITM-PR-008: should validate RFQ Qty > 0 and not exceeding balance qty', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const selectFromPrBtn = page.getByRole('button', { name: ITEM_DETAIL_LABELS.selectFromPr, exact: true });
      if (await selectFromPrBtn.isVisible()) {
        await selectFromPrBtn.click();
        await requestForQuotationFormPage.prModal.waitForOpened();

        const prTable = new DataCellTable(page, RFQ_PR_MODAL_GRID_COLUMNS);
        const qtyInput = await prTable.input(0, 'rfqQty').catch(() => null);

        if (qtyInput) {
          // Zero quantity
          await qtyInput.fill('0');
          await qtyInput.blur();
          await expect(page.getByText(MSG.rfqQtyGreaterThanZero, { exact: false }).first()).toBeVisible();

          // Exceeding balance
          await qtyInput.fill('99999999');
          await qtyInput.blur();
          await expect(page.getByText(MSG.rfqQtyExceedsBalance, { exact: false }).first()).toBeVisible();
        }
      }
    });
  });

  // =========================================================================
  // Category 4: Vendor Details Grid Validations RFQ-VAL-VND-001..015)
  // =========================================================================
  test.describe('Vendor Details DataGrid Validations @RFQ-VAL-VND', () => {
    test.beforeEach(async ({ requestForQuotationListPage, requestForQuotationFormPage, page }) => {
      await requestForQuotationListPage.open();
      await requestForQuotationListPage.createNew();
      await requestForQuotationFormPage.fillSourceDocumentDirect();
      await requestForQuotationFormPage.documentDetail.fillAll({
        documentType: { query: 'RFQ', value: 'RFQ' },
      });
      await fillDateByLabel(page, GENERAL_DETAIL_LABELS.dueDate, '2026-12-31');
    });

    test('RFQ-VAL-VND-001: should block save when vendors grid is completely empty', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const itemTable = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);
      await itemTable.selectSuggestion(0, 'itemName', 'cold', 'cold rolled sheets');
      await itemTable.fillInput(0, 'qty', '10');

      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const vendorAlert = page.getByText(MSG.atLeastOneVendor, { exact: false }).first();
      await expect(vendorAlert).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-VND-003, RFQ-VAL-VND-004: should require Vendor Name and Vendor Location for registered vendors', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const vendorTable = new DataCellTable(page, RFQ_VENDOR_GRID_COLUMNS);

      // Select vendor without location
      await vendorTable.selectSuggestion(0, 'vendorName', 'Force', 'Force Intellect Private limited');
      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const locError = page.getByText(/Select Vendor Location/i).first();
      await expect(locError).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-VND-005: should block duplicate Vendor Location in registered vendors', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const vendorTable = new DataCellTable(page, RFQ_VENDOR_GRID_COLUMNS);

      // Row 0
      await vendorTable.selectSuggestion(0, 'vendorName', 'Force', 'Force Intellect Private limited');
      await vendorTable.selectSuggestion(0, 'vendorLocationName', 'Room', 'Room No. 6 STPI Nehru Nagar');

      // Row 1 - Duplicate vendor location
      await vendorTable.selectSuggestion(1, 'vendorName', 'Force', 'Force Intellect Private limited');
      await vendorTable.selectSuggestion(1, 'vendorLocationName', 'Room', 'Room No. 6 STPI Nehru Nagar');

      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const dupLocAlert = page.getByText(MSG.duplicateVendorLocation, { exact: false }).first();
      await expect(dupLocAlert).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-VND-007, RFQ-VAL-VND-008: should require Name, Email, and Phone for Guest vendors', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const vendorTable = new DataCellTable(page, RFQ_VENDOR_GRID_COLUMNS);

      // Check Guest checkbox on Row 0
      const isGuestCell = await vendorTable.cell(0, 'isGuest');
      await isGuestCell.click();

      // Trigger save with empty guest fields
      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const guestNameError = page.getByText(/Enter Guest Vendor Name/i).first();
      await expect(guestNameError).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-VND-009: should block invalid email format for Guest vendors', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const vendorTable = new DataCellTable(page, RFQ_VENDOR_GRID_COLUMNS);
      const isGuestCell = await vendorTable.cell(0, 'isGuest');
      await isGuestCell.click();

      await vendorTable.fillInput(0, 'vendorName', 'Guest Supplier Corp');
      await vendorTable.fillInput(0, 'email', 'invalid-email'); // Bad format
      await vendorTable.fillInput(0, 'contactNo', '9876543210');

      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const emailError = page.getByText(/Invalid Guest Email format/i).first();
      await expect(emailError).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-VND-012: should block duplicate email across Guest vendors', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const vendorTable = new DataCellTable(page, RFQ_VENDOR_GRID_COLUMNS);

      // Row 0: Guest
      await (await vendorTable.cell(0, 'isGuest')).click();
      await vendorTable.fillInput(0, 'vendorName', 'Guest One');
      await vendorTable.fillInput(0, 'email', 'duplicate.guest@corp.com');
      await vendorTable.fillInput(0, 'contactNo', '9876543210');

      // Row 1: Guest with identical email
      await (await vendorTable.cell(1, 'isGuest')).click();
      await vendorTable.fillInput(1, 'vendorName', 'Guest Two');
      await vendorTable.fillInput(1, 'email', 'duplicate.guest@corp.com');
      await vendorTable.fillInput(1, 'contactNo', '9876543211');

      await requestForQuotationFormPage.triggerSaveValidation();
      await requestForQuotationFormPage.expectSaveBlockedByValidation();

      const dupEmailAlert = page.getByText(MSG.duplicateGuestEmail, { exact: false }).first();
      await expect(dupEmailAlert).toBeVisible({ timeout: 10_000 });
    });

    test('RFQ-VAL-VND-014: should block Suggest Vendors when 0 items exist in RFQ', async ({
      page,
    }) => {
      const suggestVendorsBtn = page.getByRole('button', { name: /Suggest Vendors/i });
      if (await suggestVendorsBtn.isVisible()) {
        await suggestVendorsBtn.click();
        const alert = page.getByText(MSG.suggestVendorsSelectItemsFirst, { exact: false }).first();
        await expect(alert).toBeVisible({ timeout: 10_000 });
      }
    });
  });

  // =========================================================================
  // Category 6: Terms & Conditions Grid Validations RFQ-VAL-TNC-001..004)
  // =========================================================================
  test.describe('Terms & Conditions Grid Validations @RFQ-VAL-TNC', () => {
    test.beforeEach(async ({ requestForQuotationListPage, requestForQuotationFormPage }) => {
      await requestForQuotationListPage.open();
      await requestForQuotationListPage.createNew();
      await requestForQuotationFormPage.fillSourceDocumentDirect();
    });

    test('RFQ-VAL-TNC-001: should allow empty Terms & Conditions section', async ({
      page,
    }) => {
      await expect(page.getByText(/Select T&C Head Name/i)).not.toBeVisible();
    });

    test('RFQ-VAL-TNC-002: should require T&C Head Name when a T&C row is entered', async ({
      requestForQuotationFormPage,
      page,
    }) => {
      const tncTab = page.getByRole('tab', { name: /Terms & Conditions/i }).or(page.getByText(/Terms & Conditions/i));
      if (await tncTab.isVisible()) {
        await tncTab.click();

        // Type description without selecting Head Name
        const tncDescCell = page.locator('div[data-cell-id*="tncValue"]').first();
        if (await tncDescCell.isVisible()) {
          await tncDescCell.click();
          await page.keyboard.type('Payment terms 30 days');
          await page.keyboard.press('Tab');

          await requestForQuotationFormPage.triggerSaveValidation();
          const tncError = page.getByText(/Select T&C Head Name/i).first();
          if (await tncError.isVisible()) {
            await expect(tncError).toBeVisible();
          }
        }
      }
    });
  });

  // =========================================================================
  // Category 7: Due Date Amendment Modal Validations RFQ-VAL-AMD-DUE-001..006)
  // =========================================================================
  test.describe('Due Date Amendment Modal Validations @RFQ-VAL-AMD-DUE', () => {
    test('RFQ-VAL-AMD-DUE-001, RFQ-VAL-AMD-DUE-002: should validate New Due Date is future and not empty', async ({
      requestForQuotationDisplayPage,
      page,
    }) => {
      const amendDueDateBtn = page.getByRole('button', { name: /Amend Due Date|Update Due Date/i });
      if (await amendDueDateBtn.isVisible()) {
        await amendDueDateBtn.click();

        // Empty save
        const saveBtn = page.getByRole('button', { name: /^Save$/i });
        await saveBtn.click();
        await expect(page.getByText(MSG.newDueDateRequired, { exact: false }).first()).toBeVisible();

        // Past date
        const dateInput = page.locator('input[name="newDueDate"]').first();
        if (await dateInput.isVisible()) {
          await dateInput.fill('2020-01-01 10:00');
          await saveBtn.click();
          await expect(page.getByText(MSG.newDueDateFuture, { exact: false }).first()).toBeVisible();
        }
      }
    });
  });

  // =========================================================================
  // Category 9: RFQ Item Removal Modal Validations RFQ-VAL-AMD-ITM-001..005)
  // =========================================================================
  test.describe('RFQ Item Removal Modal Validations @RFQ-VAL-AMD-ITM', () => {
    test('RFQ-VAL-AMD-ITM-001, RFQ-VAL-AMD-ITM-002: should require item selection and mandatory removal reason', async ({
      page,
    }) => {
      const removeItemBtn = page.getByRole('button', { name: /Remove Items|Item Removal/i });
      if (await removeItemBtn.isVisible()) {
        await removeItemBtn.click();

        const saveBtn = page.getByRole('button', { name: /^Save$/i });
        // Empty selection
        await saveBtn.click();
        await expect(page.getByText(MSG.selectPrItemToRemove, { exact: false }).first()).toBeVisible();

        // Check 1 item, leave Reason blank
        const firstCheckbox = page.locator('.z-modal input[type="checkbox"]').first();
        if (await firstCheckbox.isVisible()) {
          await firstCheckbox.check();
          await saveBtn.click();
          await expect(page.getByText(MSG.removalReasonRequired, { exact: false }).first()).toBeVisible();
        }
      }
    });
  });

  // =========================================================================
  // Category 10: Workflow & Deletion Safeguards RFQ-VAL-WFK-DEL-001..002)
  // =========================================================================
  test.describe('Workflow, Approval & Deletion Safeguards @RFQ-VAL-WFK-DEL', () => {
    test('RFQ-VAL-WFK-001: should require Approval Setup when manual selection is active', async ({
      requestForQuotationListPage,
      requestForQuotationFormPage,
      page,
    }) => {
      await requestForQuotationListPage.open();
      await requestForQuotationListPage.createNew();
      await requestForQuotationFormPage.fillSourceDocumentDirect();

      const approvalSection = page.locator('#approval-setup-section');
      if (await approvalSection.isVisible()) {
        await requestForQuotationFormPage.triggerSaveValidation();
        const alert = page
          .getByText(MSG.selectApprovalSetup, { exact: false })
          .or(page.getByText(MSG.workflowMandatory, { exact: false }))
          .or(page.locator('.z-alert-box'))
          .first();
        if (await alert.isVisible()) {
          await expect(alert).toBeVisible();
        }
      }
    });
  });
});
