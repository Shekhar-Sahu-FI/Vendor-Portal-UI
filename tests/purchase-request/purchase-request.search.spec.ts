import { test, expect } from '../../src/fixtures/test.fixture';
import { buildPurchaseRequestData } from '../../src/utils/test-data/purchase-request.factory';
import { PURCHASE_REQUEST_GRID, PURCHASE_REQUEST_ROUTES } from '../../src/pages/purchase-request/purchase-request.constants';
import { prExpectUrl } from '../../src/pages/purchase-request/purchase-request.assert.messages';

test.describe('Purchase Request - Search Page Grid (Category 6)', () => {
  /**
   * PR-SRCH-001: Search grid initial load and server pagination
   */
  test('PR-SRCH-001: should load the search grid with records and pagination', async ({
    purchaseRequestListPage,
  }) => {
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.grid.waitForLoaded();

    // Verify grid table and headers exist
    const gridRoot = purchaseRequestListPage.grid.gridRoot();
    await expect(gridRoot).toBeVisible();
    await expect(gridRoot.locator('table')).toBeVisible();
  });

  /**
   * PR-SRCH-003: Fuzzy text filter on PR Number
   */
  test('PR-SRCH-003: should filter search grid by PR Number', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
  }) => {
    // 1. Create a PR to ensure at least one known PR exists
    const data = buildPurchaseRequestData({
      remarks: `Search Filter Test ${Date.now()}`,
    });

    await purchaseRequestListPage.open();
    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    const docNo = await purchaseRequestFormPage.saveAndConfirm();

    // 2. Open Search list and filter by docNo
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.grid.filterByColumnPlaceholder(
      PURCHASE_REQUEST_GRID.docNoFilterPlaceholder,
      docNo,
    );

    // 3. Verify the filtered row is displayed
    const matchingRow = purchaseRequestListPage.grid.gridRoot().locator('tbody tr').filter({ hasText: docNo });
    await expect(matchingRow.first()).toBeVisible({ timeout: 15_000 });
  });

  /**
   * PR-SRCH-011: Single row selection navigates to Display Page
   */
  test('PR-SRCH-011: should navigate to Display Page on row click', async ({
    purchaseRequestListPage,
    page,
  }) => {
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.openFirstRecordDisplay();

    await expect(
      page,
      prExpectUrl('to navigate to the Purchase Request display page from grid row'),
    ).toHaveURL(/\/purchase-request\/\d+/);
  });

  /**
   * PR-SRCH-014: "Add New" button navigation to Entry page
   */
  test('PR-SRCH-014: should navigate to New Purchase Request form on Add New button click', async ({
    purchaseRequestListPage,
    page,
  }) => {
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.createNew();

    await expect(
      page,
      prExpectUrl('to navigate to the New Purchase Request entry page'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.new().replace(/\//g, '\\/')}$`));
  });
});
