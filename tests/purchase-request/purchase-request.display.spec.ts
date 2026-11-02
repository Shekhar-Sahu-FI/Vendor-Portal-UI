import { test, expect } from '../../src/fixtures/test.fixture';
import { buildPurchaseRequestData } from '../../src/utils/test-data/purchase-request.factory';
import { prExpectUrl } from '../../src/pages/purchase-request/purchase-request.assert.messages';

test.describe('Purchase Request - Display Page (Category 5)', () => {
  test('PR-DSP-001: should display header summary and status badge on display page', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    purchaseRequestDisplayPage,
    page,
  }) => {
    const data = buildPurchaseRequestData({
      remarks: `Display Test PR ${Date.now()}`,
    });

    // 1. Create a PR
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    const docNo = await purchaseRequestFormPage.saveAndConfirm();

    // 2. Open Display page via list
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.openRecordDisplay(docNo);

    await expect(
      page,
      prExpectUrl('to navigate to the Purchase Request display page'),
    ).toHaveURL(/\/purchase-request\/\d+(?!\/edit)/);

    // 3. Verify display card elements
    await expect(page.locator('text=Draft').first()).toBeVisible({ timeout: 15_000 });
  });

  test('PR-DSP-003: should filter items in Item Detail card using search input', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    purchaseRequestDisplayPage,
    page,
  }) => {
    const data = buildPurchaseRequestData({
      remarks: `Display Search PR ${Date.now()}`,
      itemRows: [
        {
          item: { query: 'I-beams', value: 'I-beams' },
          requiredQty: '25',
          prQty: '25',
          rate: '10',
          remarks: 'Searchable Item',
          techSpecification: 'Spec Search',
          scheduleDate: '2026-10-28',
          priority: { query: 'high', value: 'Very High' },
          costCenter: { query: 'Machine', value: 'Machine Operations' },
        },
      ],
    });

    await purchaseRequestListPage.open();
    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    const docNo = await purchaseRequestFormPage.saveAndConfirm();

    await purchaseRequestListPage.open();
    await purchaseRequestListPage.openRecordDisplay(docNo);

    // Filter items in display card
    await purchaseRequestDisplayPage.searchItems('I-beams');
    await purchaseRequestDisplayPage.expectItemVisible('I-beams');
  });

  test('PR-DSP-018: should navigate to edit mode when Edit button is clicked on draft PR', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    purchaseRequestDisplayPage,
    page,
  }) => {
    const data = buildPurchaseRequestData({
      remarks: `Edit Nav PR ${Date.now()}`,
    });

    await purchaseRequestListPage.open();
    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    const docNo = await purchaseRequestFormPage.saveAndConfirm();

    await purchaseRequestListPage.open();
    await purchaseRequestListPage.openRecordDisplay(docNo);

    // Click Edit button on display page
    await purchaseRequestDisplayPage.clickEdit();

    await expect(
      page,
      prExpectUrl('to switch from display to edit mode'),
    ).toHaveURL(/\/purchase-request\/\d+\/edit/);
  });
});
