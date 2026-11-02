import { test, expect } from '../../src/fixtures/test.fixture';
import { buildPurchaseRequestData } from '../../src/utils/test-data/purchase-request.factory';
import { PR_VALIDATION_MESSAGES } from '../../src/pages/purchase-request/purchase-request-validation.messages';
import { PURCHASE_REQUEST_ROUTES } from '../../src/pages/purchase-request/purchase-request.constants';

test.describe('Purchase Request - Validation (Category 3)', () => {
  test.beforeEach(async ({ purchaseRequestListPage }) => {
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.createNew();
  });

  /**
   * PR-VAL-001 through PR-VAL-006: Header mandatory fields validation
   */
  test('PR-VAL-001 to 006: should block save and show validation errors when mandatory header fields are empty', async ({
    purchaseRequestFormPage,
    page,
  }) => {
    // Attempt save with completely empty form
    await purchaseRequestFormPage.triggerSaveValidation();

    // Verify save is blocked and user remains on new PR form
    await purchaseRequestFormPage.expectSaveBlocked();

    // Verify company or general validation message / error element appears
    const hasErrorIndicator = await page
      .locator('.text-destructive, .text-red-500, .z-alert-box')
      .first()
      .isVisible();
    expect(hasErrorIndicator).toBeTruthy();
  });

  /**
   * PR-VAL-008: Invalid email format validation on Requested By Email
   */
  test('PR-VAL-008: should validate email format in Requested By Email', async ({
    purchaseRequestFormPage,
    page,
  }) => {
    const data = buildPurchaseRequestData({
      requestedByEmail: 'not-an-email',
    });

    await purchaseRequestFormPage.fill(data);
    await purchaseRequestFormPage.triggerSaveValidation();

    await purchaseRequestFormPage.expectSaveBlocked();
    const errorMsg = page.getByText(PR_VALIDATION_MESSAGES.emailInvalid, { exact: false }).first();
    await expect(errorMsg).toBeVisible({ timeout: 10_000 });
  });

  /**
   * PR-VAL-013: Reference Date cannot be greater than PR Date
   */
  test('PR-VAL-013: should block save when Reference Date is greater than PR Date', async ({
    purchaseRequestFormPage,
    page,
  }) => {
    const data = buildPurchaseRequestData({
      documentDate: '2026-05-01',
      referenceNo: 'REF-VAL-001',
      referenceDate: '2026-06-01', // After PR date
    });

    await purchaseRequestFormPage.fill(data);
    await purchaseRequestFormPage.triggerSaveValidation();

    await purchaseRequestFormPage.expectSaveBlocked();
    const errorMsg = page.getByText(PR_VALIDATION_MESSAGES.refDateGreater, { exact: false }).first();
    await expect(errorMsg).toBeVisible({ timeout: 10_000 });
  });

  /**
   * PR-VAL-014: At least one item is required in item detail
   */
  test('PR-VAL-014: should block save when item detail is empty', async ({
    purchaseRequestFormPage,
    page,
  }) => {
    const data = buildPurchaseRequestData({
      itemRows: [], // No items
    });

    await purchaseRequestFormPage.fill(data);
    await purchaseRequestFormPage.triggerSaveValidation();

    await purchaseRequestFormPage.expectSaveBlocked();
    const alertOrError = page
      .getByText(PR_VALIDATION_MESSAGES.atLeastOneItem, { exact: false })
      .or(page.locator('.z-alert-box'))
      .first();
    await expect(alertOrError).toBeVisible({ timeout: 10_000 });
  });

  /**
   * PR-VAL-016 & PR-VAL-018: Zero or negative quantity validations
   * Legacy tags: @TC-SAV-32, @TC-SAV-33, @TC-SAV-34
   */
  test('PR-VAL-016, PR-VAL-018: should block save when Required Qty or PR Qty is zero @TC-SAV-32 @TC-SAV-33 @TC-SAV-34', async ({
    purchaseRequestFormPage,
    page,
  }) => {
    const data = buildPurchaseRequestData({
      itemRows: [
        {
          item: { query: 'I-beams', value: 'I-beams' },
          requiredQty: '0',
          prQty: '0',
          rate: '0',
          remarks: 'Testing 0 Qty Boundary',
          techSpecification: 'Boundary test',
          scheduleDate: '2026-10-28',
          priority: { query: 'high', value: 'Very High' },
          costCenter: { query: 'Machine', value: 'Machine Operations' },
        },
      ],
    });

    await purchaseRequestFormPage.fill(data);
    await purchaseRequestFormPage.triggerSaveValidation();

    // Verify form save is blocked
    await purchaseRequestFormPage.expectSaveBlocked();

    // Validation alert or message should be triggered
    const qtyError = page
      .getByText(PR_VALIDATION_MESSAGES.reqQtyRequired, { exact: false })
      .or(page.getByText(PR_VALIDATION_MESSAGES.prQtyRequired, { exact: false }))
      .or(page.locator('.z-alert-box, .text-destructive'))
      .first();
    await expect(qtyError).toBeVisible({ timeout: 10_000 });
  });

  /**
   * PR-VAL-025: Duplicate item with same make, cost center, and schedule date
   */
  test('PR-VAL-025: should block duplicate item combinations', async ({
    purchaseRequestFormPage,
    page,
  }) => {
    const duplicateRow = {
      item: { query: 'I-beams', value: 'I-beams' },
      requiredQty: '10',
      prQty: '10',
      rate: '100',
      remarks: 'Duplicate item test',
      techSpecification: 'Spec 1',
      scheduleDate: '2026-10-28',
      priority: { query: 'high', value: 'Very High' },
      costCenter: { query: 'Machine', value: 'Machine Operations' },
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

  /**
   * PR-VAL-031: Duplicate Email in Inform To list
   */
  test('PR-VAL-031: should block duplicate emails in Inform To section', async ({
    purchaseRequestFormPage,
    page,
  }) => {
    const data = buildPurchaseRequestData({
      informToRows: [
        { query: 'sai', value: 'sai ui' },
        { query: 'sai', value: 'sai ui' }, // Duplicate email/user
      ],
    });

    await purchaseRequestFormPage.fill(data);
    await purchaseRequestFormPage.triggerSaveValidation();

    await purchaseRequestFormPage.expectSaveBlocked();
    const dupEmailAlert = page
      .getByText(PR_VALIDATION_MESSAGES.duplicateEmail, { exact: false })
      .or(page.locator('.z-alert-box, .text-destructive'))
      .first();
    await expect(dupEmailAlert).toBeVisible({ timeout: 10_000 });
  });
});
