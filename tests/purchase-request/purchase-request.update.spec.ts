import { test, expect } from '../../src/fixtures/test.fixture';
import { buildPurchaseRequestData } from '../../src/utils/test-data/purchase-request.factory';
import { buildPurchaseRequestVerifyData } from '../../src/utils/test-data/purchase-request.data';
import { getFieldValue } from '../../src/utils/field-accessor';
import { GENERAL_DETAIL_LABELS, PURCHASE_REQUEST_GRID } from '../../src/pages/purchase-request/purchase-request.constants';
import {
  prExpectField,
  prExpectUrl,
} from '../../src/pages/purchase-request/purchase-request.assert.messages';

test.describe('Purchase Request - Edit & Update Category 4', () => {
  /**
   * PR-EDT-001: Update remarks on an existing purchase request
   */
  test('PR-EDT-001: should update remarks on an existing purchase request', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const updatedRemarks = `Updated PR ${Date.now()}`;
    const data = buildPurchaseRequestData({
      remarks: 'Initial PR Remarks',
    });

    // 1. Create a fresh PR
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    await purchaseRequestFormPage.saveAndConfirm();

    // 2. Open created PR in edit mode
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.openFirstRecordForEdit();

    await expect(
      page,
      prExpectUrl('to open an existing Purchase Request in edit mode before update'),
    ).toHaveURL(/\/purchase-request\/\d+\/edit/);

    // 3. Update remarks
    await purchaseRequestFormPage.updateRemarks(updatedRemarks);

    // 4. Verify updated remarks persisted
    await expect
      .poll(() => getFieldValue(page, GENERAL_DETAIL_LABELS.remarks), {
        message: prExpectField(GENERAL_DETAIL_LABELS.remarks, updatedRemarks),
      })
      .toBe(updatedRemarks);
  });

  /**
   * PR-EDT-002: Verify saved fields are retained when reopened in edit mode
   * (Migrated and consolidated from legacy purchase-request.verify-saved.spec.ts)
   */
  test('PR-EDT-002: should retain all saved fields when reopened in edit mode', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildPurchaseRequestVerifyData(marker);

    // 1. Create and save PR
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    const docNo = await purchaseRequestFormPage.saveAndConfirm();

    // 2. Re-open via search filter into edit mode
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.openSavedRecordForEdit(
      docNo,
      PURCHASE_REQUEST_GRID.docNoFilterPlaceholder,
    );

    await expect(
      page,
      prExpectUrl('to open the saved Purchase Request in edit mode'),
    ).toHaveURL(/\/purchase-request\/\d+\/edit/);

    // 3. Validate form data retention
    await purchaseRequestFormPage.expectSavedData(data);
  });

  /**
   * PR-EDT-006: Modify line item quantities and rates in edit mode
   */
  test('PR-EDT-006: should modify line item quantity and rate in edit mode', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const data = buildPurchaseRequestData({
      itemRows: [
        {
          item: { query: 'I-beams', value: 'I-beams' },
          requiredQty: '50',
          prQty: '50',
          rate: '10',
          remarks: 'Before update',
          techSpecification: 'Spec 1',
          scheduleDate: '2026-10-28',
          priority: { query: 'high', value: 'Very High' },
          costCenter: { query: 'Machine', value: 'Machine Operations' },
        },
      ],
    });

    await purchaseRequestListPage.open();
    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    await purchaseRequestFormPage.saveAndConfirm();

    // Open first row for edit
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.openFirstRecordForEdit();

    // Modify quantity on row 0
    await purchaseRequestFormPage.table.editInput(0, 'prQty', '75');
    await purchaseRequestFormPage.table.editInput(0, 'rate', '12');

    // Save and verify confirmation
    await purchaseRequestFormPage.clickSaveAndConfirm();
    await expect(page.locator('.z-toast').first()).toBeVisible({ timeout: 15_000 });
  });
});
