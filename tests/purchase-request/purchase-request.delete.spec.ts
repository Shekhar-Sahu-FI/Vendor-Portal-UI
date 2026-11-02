import { test, expect } from '../../src/fixtures/test.fixture';
import { buildPurchaseRequestData } from '../../src/utils/test-data/purchase-request.factory';
import { PURCHASE_REQUEST_ROUTES } from '../../src/pages/purchase-request/purchase-request.constants';
import { prExpectUrl } from '../../src/pages/purchase-request/purchase-request.assert.messages';

test.describe('Purchase Request - Delete Category 3 / 5', () => {
  /**
   * PR-CFG-018 / PR-VAL-033: Delete Draft Purchase Request with Mandatory Delete Reason
   */
  test('PR-CFG-018: should delete a draft purchase request with mandatory reason', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const data = buildPurchaseRequestData({ remarks: `Delete PR ${Date.now()}` });

    await purchaseRequestListPage.open();
    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    await purchaseRequestFormPage.saveAndConfirm();

    await purchaseRequestListPage.open();
    await purchaseRequestListPage.openFirstRecordForEdit();

    await expect(
      page,
      prExpectUrl('to open the Purchase Request in edit mode before delete'),
    ).toHaveURL(/\/purchase-request\/\d+\/edit/);

    await purchaseRequestFormPage.deleteCurrent(process.env.PR_DELETE_REASON ?? 'Automated test cleanup');

    await expect(
      page,
      prExpectUrl('to return to the Purchase Request list after delete'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.list().replace(/\//g, '\\/')}`));
  });
});
