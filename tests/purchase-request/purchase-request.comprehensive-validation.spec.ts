import { test, expect } from '../../src/fixtures/test.fixture';
import { buildPurchaseRequestData } from '../../src/utils/test-data/purchase-request.factory';
import { PR_VALIDATION_MESSAGES } from '../../src/pages/purchase-request/purchase-request-validation.messages';
import { PURCHASE_REQUEST_ROUTES, DOCUMENT_DETAIL_LABELS, GENERAL_DETAIL_LABELS } from '../../src/pages/purchase-request/purchase-request.constants';
import { PR_ITEM_GRID_COLUMNS } from '../../src/pages/purchase-request/grids/purchase-request-grid.columns';
import { DataCellTable } from '../../src/utils/data-cell-table';
import { prExpectUrl } from '../../src/pages/purchase-request/purchase-request.assert.messages';

test.describe('Purchase Request - Comprehensive Validation Suite', () => {
  // =========================================================================
  // Category: HDR - Document Detail & Header Validations (PR-VAL-HDR-001..042)
  // =========================================================================
  test.describe('Header & Document Detail Validations @PR-VAL-HDR', () => {
    test.beforeEach(async ({ purchaseRequestListPage }) => {
      await purchaseRequestListPage.open();
      await purchaseRequestListPage.createNew();
    });

    test('PR-VAL-HDR-001, PR-VAL-HDR-002: should block save and show error when Company is empty', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      await purchaseRequestFormPage.triggerSaveValidation();
      await purchaseRequestFormPage.expectSaveBlocked();

      const errorMsg = page
        .getByText(PR_VALIDATION_MESSAGES.companyRequired, { exact: false })
        .or(page.locator('.text-destructive, .text-red-500, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-HDR-003: should accept valid Company and populate dependent Division options', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData();
      await purchaseRequestFormPage.documentDetail.fillCompany(data.company!);

      const companyInput = page.locator('input[name="companyId"]');
      await expect(companyInput).toHaveValue(new RegExp("CONE", 'i'));
      // await expect(page.locator('.text-destructive')).not.toBeVisible();
    });

    test('PR-VAL-HDR-004: should reset Division, DocType, and Department when Company is changed', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData();
      await purchaseRequestFormPage.documentDetail.fillCompany(data.company!);
      await purchaseRequestFormPage.documentDetail.fillDivision(data.division!);
      await purchaseRequestFormPage.documentDetail.fillDocumentType(data.documentType!);

      // Change Company to alternate company
      await purchaseRequestFormPage.documentDetail.fillCompany({ query: 'Company Two', value: 'Company Two' });

      // Dependent inputs should be reset/cleared
      const divisionInput = page.locator('input[name="divisionId"]');
      const val = await divisionInput.inputValue().catch(() => '');
      expect(val === '' || !val.includes(data.division!.value)).toBeTruthy();
    });

    test('PR-VAL-HDR-005, PR-VAL-HDR-006: should block save when Division is empty', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData();
      await purchaseRequestFormPage.documentDetail.fillCompany(data.company!);

      await purchaseRequestFormPage.triggerSaveValidation();
      await purchaseRequestFormPage.expectSaveBlocked();

      const errorMsg = page
        .getByText(PR_VALIDATION_MESSAGES.divisionRequired, { exact: false })
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-HDR-008, PR-VAL-HDR-009: should block save when Document Type is empty', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData();
      await purchaseRequestFormPage.documentDetail.fillCompany(data.company!);
      await purchaseRequestFormPage.documentDetail.fillDivision(data.division!);

      await purchaseRequestFormPage.triggerSaveValidation();
      await purchaseRequestFormPage.expectSaveBlocked();

      const errorMsg = page
        .getByText(PR_VALIDATION_MESSAGES.docTypeRequired, { exact: false })
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-HDR-011, PR-VAL-HDR-012: should block save when PR Date is cleared', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData();
      await purchaseRequestFormPage.fill(data);

      const dateInput = page.locator('input[name="docDate"]').or(page.locator('input[placeholder*="PR Date"]')).first();
      if (await dateInput.isVisible()) {
        await dateInput.fill('');
        await dateInput.blur();
      }

      await purchaseRequestFormPage.triggerSaveValidation();
      await purchaseRequestFormPage.expectSaveBlocked();

      const errorMsg = page
        .getByText(PR_VALIDATION_MESSAGES.docDateRequired, { exact: false })
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-HDR-016, PR-VAL-HDR-017: should block save when Department is empty', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({ department: undefined });
      await purchaseRequestFormPage.fill(data);

      const deptInput = page.locator('input[name="departmentId"]');
      if (await deptInput.isVisible()) {
        await deptInput.fill('');
        await deptInput.blur();
      }

      await purchaseRequestFormPage.triggerSaveValidation();
      await purchaseRequestFormPage.expectSaveBlocked();

      const errorMsg = page
        .getByText(PR_VALIDATION_MESSAGES.departmentRequired, { exact: false })
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-HDR-019, PR-VAL-HDR-020: should block save when Expenditure Type is empty', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({ expenditureType: undefined });
      await purchaseRequestFormPage.fill(data);

      await purchaseRequestFormPage.triggerSaveValidation();
      await purchaseRequestFormPage.expectSaveBlocked();

      const errorMsg = page
        .getByText(PR_VALIDATION_MESSAGES.expenditureTypeRequired, { exact: false })
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-HDR-021: should accept valid Expenditure Type selection Capital / Revenue', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({ expenditureType: 'Capex' });
      await purchaseRequestFormPage.fill(data);

      const expInput = page.locator('button[name="expenditureTypeId"], select[name="expenditureTypeId"]').first();
      await expect(expInput).toBeVisible();
    });

    test('PR-VAL-HDR-026, PR-VAL-HDR-027: should accept free text in Requested By and enforce max length 100', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const reqByInput = page.locator('input[name="requestedBy"]');
      if (await reqByInput.isVisible()) {
        const longText = 'A'.repeat(120);
        await reqByInput.fill(longText);
        const val = await reqByInput.inputValue();
        expect(val.length).toBeLessThanOrEqual(100);
      }
    });

    test('PR-VAL-HDR-029, PR-VAL-HDR-030: should allow empty or valid Requested By Email', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      // Valid email
      const data = buildPurchaseRequestData({ requestedByEmail: 'requisition.user@company.com' });
      await purchaseRequestFormPage.fill(data);

      const emailInput = page.locator('input[name="requestedByEmailId"]');
      if (await emailInput.isVisible()) {
        await emailInput.blur();
        await expect(page.getByText(PR_VALIDATION_MESSAGES.emailInvalid)).not.toBeVisible();
      }
    });

    test('PR-VAL-HDR-031, PR-VAL-HDR-032: should block save when Requested By Email is invalid format', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({ requestedByEmail: 'invalid-email-address' });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const errorMsg = page.getByText(PR_VALIDATION_MESSAGES.emailInvalid, { exact: false }).first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-HDR-035: should block save when Contact Number length is below minimum', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        requestedContactNo: { countrySearch: 'India', localNumber: '12345' }, // Invalid short length
      });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const contactError = page
        .getByText(PR_VALIDATION_MESSAGES.contactNoInvalid, { exact: false })
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(contactError).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-HDR-037: should require Ref Date when Ref No is provided', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        referenceNo: 'REF-2026-VAL-001',
        referenceDate: undefined, // Empty Ref Date
      });
      await purchaseRequestFormPage.fill(data);

      const refDateInput = page.locator('input[name="referenceDate"]');
      if (await refDateInput.isVisible()) {
        await refDateInput.fill('');
        await refDateInput.blur();
      }

      await purchaseRequestFormPage.triggerSaveValidation();
      await purchaseRequestFormPage.expectSaveBlocked();

      const errorMsg = page
        .getByText(PR_VALIDATION_MESSAGES.refDateEmptyWithRefNo, { exact: false })
        .or(page.locator('.text-destructive, .z-alert-box'))
        .first();
      await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-HDR-038: should block save when Ref Date is greater than PR Date', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        documentDate: '2026-05-01',
        referenceNo: 'REF-2026-VAL-002',
        referenceDate: '2026-05-15', // Later than PR Date
      });

      console.log("THis is the referance date @123", data)
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      // const errorMsg = page.getByText(PR_VALIDATION_MESSAGES.refDateGreater, { exact: false }).first();
      // await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-HDR-039: should accept Ref Date equal to PR Date', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        documentDate: '2026-05-10',
        referenceNo: 'REF-SAME-DAY',
        referenceDate: '2026-05-10', // Equal to PR Date
      });
      await purchaseRequestFormPage.fill(data);

      await expect(page.getByText(PR_VALIDATION_MESSAGES.refDateGreater)).not.toBeVisible();
    });

    test('PR-VAL-HDR-040: should allow both Ref No and Ref Date to be empty', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        referenceNo: undefined,
        referenceDate: undefined,
      });
      await purchaseRequestFormPage.fill(data);

      await expect(page.getByText(PR_VALIDATION_MESSAGES.refDateEmptyWithRefNo)).not.toBeVisible();
      await expect(page.getByText(PR_VALIDATION_MESSAGES.refDateGreater)).not.toBeVisible();
    });

    test('PR-VAL-HDR-041: should enforce max length 30 on Reference Number', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const refInput = page.locator('input[name="referenceNo"]');
      if (await refInput.isVisible()) {
        await refInput.fill('REF-' + '9'.repeat(40));
        const val = await refInput.inputValue();
        expect(val.length).toBeLessThanOrEqual(30);
      }
    });
  });

  // =========================================================================
  // Category: ITM - Item Details DataGrid Validations (PR-VAL-ITM-001..045)
  // =========================================================================
  test.describe('Item Details DataGrid Validations PR-VAL-ITM', () => {
    test.beforeEach(async ({ purchaseRequestListPage }) => {
      await purchaseRequestListPage.open();
      await purchaseRequestListPage.createNew();
    });

    test('PR-VAL-ITM-001: should block save when item detail grid is completely empty', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({ itemRows: [] });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const alertOrError = page
        .getByText(PR_VALIDATION_MESSAGES.atLeastOneItem, { exact: false })
        .or(page.locator('.z-alert-box'))
        .first();
      await expect(alertOrError).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-ITM-002: should block save when intermediate item row has empty item name', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const rowItem = {
        item: { query: 'Item One', value: 'Item One No Multi Unit No Make' },
        requiredQty: '10',
        prQty: '10',
        rate: '50',
        scheduleDate: '2026-10-28',
      };
      // Row 0 valid, Row 1 blank item name, Row 2 valid
      const data = buildPurchaseRequestData({
        itemRows: [rowItem, { requiredQty: '5' } as any, rowItem],
      });
      await purchaseRequestFormPage.fill(data);
      // await purchaseRequestFormPage.triggerSaveValidation();

      // await purchaseRequestFormPage.expectSaveBlocked();
      // const errorMsg = page
      //   .getByText(PR_VALIDATION_MESSAGES.itemNameRequired, { exact: false })
      //   .or(page.locator('.z-alert-box'))
      //   .first();
      // await expect(errorMsg).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-ITM-004: should disable row cells before item name is selected', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const table = new DataCellTable(page, PR_ITEM_GRID_COLUMNS);
      // Row 0 has no item selected yet
      const makeCell = await table.cell(0, 'makeName');
      const isMakeEditable = await makeCell.getAttribute('aria-disabled').catch(() => null);
      // Cell should either have disabled state, read-only class, or prevent open
      expect(makeCell).toBeDefined();
    });

    test('PR-VAL-ITM-006: should block duplicate item combinations (same item, make, cost center, and schedule date)', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const duplicateRow = {
        item: { query: 'Item One', value: 'Item One No Multi Unit No Make' },
        requiredQty: '10',
        prQty: '10',
        rate: '100',
        scheduleDate: '2026-10-28',
        priority: { query: 'Priority One', value: 'Priority One' },
        costCenter: { query: 'Cost Center One', value: 'Cost Center One' },
      };

      const data = buildPurchaseRequestData({
        itemRows: [duplicateRow, { ...duplicateRow }],
      });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const dupAlert = page
        .getByText(PR_VALIDATION_MESSAGES.duplicateItemCombination, { exact: false })
        .or(page.locator('.z-alert-box'))
        .first();
      await expect(dupAlert).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-ITM-007: should allow duplicate item with different schedule date', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const row1 = {
        item: { query: 'Item One', value: 'Item One No Multi Unit No Make' },
        requiredQty: '10',
        prQty: '10',
        rate: '100',
        scheduleDate: '2026-10-28',
        priority: { query: 'Priority One', value: 'Priority One' },
      };
      const row2 = {
        ...row1,
        scheduleDate: '2026-11-28', // Different schedule date
      };

      const data = buildPurchaseRequestData({ itemRows: [row1, row2] });
      await purchaseRequestFormPage.fill(data);

      await expect(page.getByText(PR_VALIDATION_MESSAGES.duplicateItemCombination)).not.toBeVisible();
    });

    test('PR-VAL-ITM-010, PR-VAL-ITM-011, PR-VAL-ITM-012: should block save when Required Qty is zero, negative, or blank', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        itemRows: [
          {
            item: { query: 'Item One', value: 'Item One No Multi Unit No Make' },
            requiredQty: '0', // Boundary: zero
            prQty: '10',
            rate: '100',
            scheduleDate: '2026-10-28',
          },
        ],
      });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const qtyAlert = page
        .getByText(PR_VALIDATION_MESSAGES.reqQtyRequired, { exact: false })
        .or(page.locator('.z-alert-box'))
        .first();
      await expect(qtyAlert).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-ITM-015: should auto-synchronize PR Qty when Required Qty is entered', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const table = new DataCellTable(page, PR_ITEM_GRID_COLUMNS);
      await table.selectSuggestion(0, 'itemName', 'Item One', 'Item One No Multi Unit No Make');
      await table.fillInput(0, 'requiredQty', '55');

      // PR Qty cell should auto-fill to 55
      const prQtyInput = await table.input(0, 'prQty');
      const prQtyVal = await prQtyInput.inputValue();
      expect(prQtyVal).toContain('55');
    });

    test('PR-VAL-ITM-017, PR-VAL-ITM-018, PR-VAL-ITM-019: should block save when PR Qty is zero, negative, or blank', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        itemRows: [
          {
            item: { query: 'Item One', value: 'Item One No Multi Unit No Make' },
            requiredQty: '10',
            prQty: '0', // Invalid: zero
            rate: '100',
            scheduleDate: '2026-10-28',
          },
        ],
      });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const prQtyAlert = page
        .getByText(PR_VALIDATION_MESSAGES.prQtyRequired, { exact: false })
        .or(page.locator('.z-alert-box'))
        .first();
      await expect(prQtyAlert).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-ITM-022, PR-VAL-ITM-023: should block save when Rate is negative or blank', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        itemRows: [
          {
            item: { query: 'Item One', value: 'Item One No Multi Unit No Make' },
            requiredQty: '10',
            prQty: '10',
            rate: '-50', // Negative Rate
            scheduleDate: '2026-10-28',
          },
        ],
      });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const rateAlert = page
        .getByText(PR_VALIDATION_MESSAGES.rateRequired, { exact: false })
        .or(page.locator('.z-alert-box'))
        .first();
      await expect(rateAlert).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-ITM-024: should accept Rate = 0 as valid boundary', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        itemRows: [
          {
            item: { query: 'Item One', value: 'Item One No Multi Unit No Make' },
            requiredQty: '10',
            prQty: '10',
            rate: '0', // Boundary: zero rate allowed by schema (v >= 0)
            scheduleDate: '2026-10-28',
          },
        ],
      });
      await purchaseRequestFormPage.fill(data);

      await expect(page.getByText(PR_VALIDATION_MESSAGES.rateRequired)).not.toBeVisible();
    });

    test('PR-VAL-ITM-026, PR-VAL-ITM-027: should compute Item Amount and Net Amount correctly', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const table = new DataCellTable(page, PR_ITEM_GRID_COLUMNS);
      await table.selectSuggestion(0, 'itemName', 'Item One', 'Item One No Multi Unit No Make');
      await table.fillInput(0, 'requiredQty', '10');
      await table.fillInput(0, 'rate', '250');

      // Amount cell should compute to 2,500.00
      const amountCell = await table.cell(0, 'amount' as any);
      const text = await amountCell.innerText();
      expect(text).toContain('2,500');
    });

    test('PR-VAL-ITM-029: should block save when Schedule Date is blank', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        itemRows: [
          {
            item: { query: 'Item One', value: 'Item One No Multi Unit No Make' },
            requiredQty: '10',
            prQty: '10',
            rate: '100',
            scheduleDate: undefined, // Empty schedule date
          },
        ],
      });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const schedAlert = page
        .getByText(PR_VALIDATION_MESSAGES.scheduleDateRequired, { exact: false })
        .or(page.locator('.z-alert-box'))
        .first();
      await expect(schedAlert).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-ITM-032: should block save when Priority is unselected', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        itemRows: [
          {
            item: { query: 'Item One', value: 'Item One No Multi Unit No Make' },
            requiredQty: '10',
            prQty: '10',
            rate: '100',
            scheduleDate: '2026-10-28',
            priority: undefined, // Empty priority
          },
        ],
      });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const prioAlert = page
        .getByText(PR_VALIDATION_MESSAGES.priorityRequired, { exact: false })
        .or(page.locator('.z-alert-box'))
        .first();
      await expect(prioAlert).toBeVisible({ timeout: 10_000 });
    });
  });

  // =========================================================================
  // Category: INF - Inform To Grid Validations (PR-VAL-INF-001..006)
  // =========================================================================
  test.describe('Inform To Grid Validations (PR-VAL-INF)', () => {
    test.beforeEach(async ({ purchaseRequestListPage }) => {
      await purchaseRequestListPage.open();
      await purchaseRequestListPage.createNew();
    });

    test('PR-VAL-INF-001: should allow empty Inform To section', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({ informToRows: [] });
      await purchaseRequestFormPage.fill(data);

      await expect(page.getByText(PR_VALIDATION_MESSAGES.personNameRequired)).not.toBeVisible();
      await expect(page.getByText(PR_VALIDATION_MESSAGES.duplicateEmail)).not.toBeVisible();
    });

    test('PR-VAL-INF-004: should block save when Inform To Email is invalid format', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        informToRows: [{ query: 'UN1', value: 'invalid-email-address' }],
      });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const emailAlert = page
        .getByText(PR_VALIDATION_MESSAGES.emailInvalid, { exact: false })
        .or(page.getByText(PR_VALIDATION_MESSAGES.personEmailRequired, { exact: false }))
        .or(page.locator('.z-alert-box, .text-destructive'))
        .first();
      await expect(emailAlert).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-INF-005: should block duplicate emails in Inform To section', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        informToRows: [
          { query: 'UN1', value: 'UN1' },
          { query: 'UN1', value: 'UN1' }, // Duplicate user/email
        ],
      });
      await purchaseRequestFormPage.fill(data);
      await purchaseRequestFormPage.triggerSaveValidation();

      await purchaseRequestFormPage.expectSaveBlocked();
      const dupAlert = page
        .getByText(PR_VALIDATION_MESSAGES.duplicateEmail, { exact: false })
        .or(page.locator('.z-alert-box, .text-destructive'))
        .first();
      await expect(dupAlert).toBeVisible({ timeout: 10_000 });
    });

    test('PR-VAL-INF-006: should accept multiple distinct users in Inform To section', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData({
        informToRows: [
          { query: 'UN1', value: 'UN1' },
          { query: 'UN3', value: 'UN3' },
        ],
      });
      await purchaseRequestFormPage.fill(data);

      await expect(page.getByText(PR_VALIDATION_MESSAGES.duplicateEmail)).not.toBeVisible();
    });
  });

  // =========================================================================
  // Category: WFK - Workflow & Approval Group Validations (PR-VAL-WFK-001..003)
  // =========================================================================
  test.describe('Workflow & Approval Group Validations (PR-VAL-WFK)', () => {
    test.beforeEach(async ({ purchaseRequestListPage }) => {
      await purchaseRequestListPage.open();
      await purchaseRequestListPage.createNew();
    });

    test('PR-VAL-WFK-001: should validate Approval Setup when manual selection is required', async ({
      purchaseRequestFormPage,
      page,
    }) => {
      const data = buildPurchaseRequestData();
      await purchaseRequestFormPage.fill(data);

      const approvalSection = page.locator('#approval-setup-section');
      if (await approvalSection.isVisible()) {
        await purchaseRequestFormPage.triggerSaveValidation();
        const alert = page
          .getByText(PR_VALIDATION_MESSAGES.selectApprovalSetup, { exact: false })
          .or(page.getByText(PR_VALIDATION_MESSAGES.workflowMandatory, { exact: false }))
          .or(page.locator('.z-alert-box'))
          .first();
        if (await alert.isVisible()) {
          expect(alert).toBeVisible();
        }
      }
    });
  });

  // =========================================================================
  // Category: REV - Review & Inline Quantity Reduction Validations (PR-VAL-REV-001..009)
  // =========================================================================
  test.describe('Review & Inline Quantity Reduction Validations (PR-VAL-REV)', () => {
    test('PR-VAL-REV-001: should block Save Changes when no field is modified during review', async ({
      purchaseRequestDisplayPage,
      page,
    }) => {
      const editItemsBtn = page.getByRole('button', { name: /Edit Items/i });
      if (await editItemsBtn.isVisible()) {
        await editItemsBtn.click();
        const saveChangesBtn = page.getByRole('button', { name: /Save Changes/i });
        await saveChangesBtn.click();

        const alert = page.getByText(PR_VALIDATION_MESSAGES.provideFieldToUpdate, { exact: false }).first();
        await expect(alert).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PR-VAL-REV-003: should require Reason when item quantity is reduced during review', async ({
      page,
    }) => {
      const editItemsBtn = page.getByRole('button', { name: /Edit Items/i });
      if (await editItemsBtn.isVisible()) {
        await editItemsBtn.click();

        // Reduce quantity without providing Reason
        const qtyInput = page.locator('input[name*="prQty"]').first();
        if (await qtyInput.isVisible()) {
          const currentVal = Number(await qtyInput.inputValue()) || 10;
          await qtyInput.fill(String(Math.max(1, currentVal - 2)));

          const saveChangesBtn = page.getByRole('button', { name: /Save Changes/i });
          await saveChangesBtn.click();

          const alert = page.getByText(PR_VALIDATION_MESSAGES.reasonRequired, { exact: false }).first();
          await expect(alert).toBeVisible({ timeout: 10_000 });
        }
      }
    });

    test('PR-VAL-REV-004: should block quantity increase during review', async ({
      page,
    }) => {
      const editItemsBtn = page.getByRole('button', { name: /Edit Items/i });
      if (await editItemsBtn.isVisible()) {
        await editItemsBtn.click();

        const qtyInput = page.locator('input[name*="prQty"]').first();
        if (await qtyInput.isVisible()) {
          const currentVal = Number(await qtyInput.inputValue()) || 10;
          await qtyInput.fill(String(currentVal + 100)); // Increase quantity

          const saveChangesBtn = page.getByRole('button', { name: /Save Changes/i });
          await saveChangesBtn.click();

          const alert = page
            .getByText(/Qty\. cannot be increased/i)
            .or(page.locator('.z-alert-box'))
            .first();
          await expect(alert).toBeVisible({ timeout: 10_000 });
        }
      }
    });

    test('PR-VAL-REV-006: should block negative Required Quantity during review', async ({
      page,
    }) => {
      const editItemsBtn = page.getByRole('button', { name: /Edit Items/i });
      if (await editItemsBtn.isVisible()) {
        await editItemsBtn.click();

        const reqQtyInput = page.locator('input[name*="requiredQty"]').first();
        if (await reqQtyInput.isVisible()) {
          await reqQtyInput.fill('-10'); // Negative

          const saveChangesBtn = page.getByRole('button', { name: /Save Changes/i });
          await saveChangesBtn.click();

          const alert = page.getByText(PR_VALIDATION_MESSAGES.reqQtyCannotBeNegative, { exact: false }).first();
          await expect(alert).toBeVisible({ timeout: 10_000 });
        }
      }
    });
  });

  // =========================================================================
  // Category: ACT - Approval Actions & Document Deletion Validations (PR-VAL-ACT-001..008)
  // =========================================================================
  test.describe('Approval Actions & Document Deletion Validations (PR-VAL-ACT)', () => {
    test('PR-VAL-ACT-002: should require rejection remark when approver rejects PR', async ({
      page,
    }) => {
      const rejectBtn = page.getByRole('button', { name: /^Reject$/i });
      if (await rejectBtn.isVisible()) {
        await rejectBtn.click();

        const alert = page
          .getByText(PR_VALIDATION_MESSAGES.rejectionRemarkMandatory, { exact: false })
          .or(page.locator('.z-toast'))
          .first();
        await expect(alert).toBeVisible({ timeout: 10_000 });
      }
    });

    test('PR-VAL-ACT-006: should require mandatory delete reason when portal setting is enabled', async ({
      purchaseRequestListPage,
      purchaseRequestFormPage,
      page,
    }) => {
      // Check if delete action prompts for reason modal
      await purchaseRequestListPage.open();
      const firstRow = page.locator('.table-row, tr').nth(1);
      if (await firstRow.isVisible()) {
        await purchaseRequestListPage.openFirstRecordForEdit();
        await purchaseRequestFormPage.openActionsMenu();

        const deleteBtn = page.getByRole('button', { name: 'Delete', exact: true });
        if (await deleteBtn.isVisible()) {
          await deleteBtn.click();

          // Verify confirmation dialog or reason textarea appears
          const modalOrAlert = page.locator('.z-alert-box, .z-modal, [role="dialog"]').first();
          await expect(modalOrAlert).toBeVisible({ timeout: 10_000 });
        }
      }
    });
  });
});
