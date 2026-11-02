import { test, expect } from '../../src/fixtures/test.fixture';
import { PURCHASE_ORDER_ROUTES } from '../../src/pages/purchase-order/purchase-order.constants';
import { PurchaseOrderFillData } from '../../src/types/purchase-order.types';

test.describe('Purchase Order - Delete (Direct Reference)', () => {
  test('should delete a draft direct reference purchase order (TC-PO-DIR-DEL-01)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    const data: PurchaseOrderFillData = {
      company: { query: 'Bhilai', value: 'Bhilai Steel Plant' },
      division: { query: 'Plant', value: 'Plant Division' },
      documentType: { query: 'Urgent', value: 'Urgent' },
      expenditureType: { query: 'Capex', value: 'Capex' },
      referenceDocumentType: { query: 'Direct', value: 'Direct' },
      vendor: { query: 'Shekhar', value: 'Shekhar Enterprise' },
      validityDate: '2026-12-30',
      remarks: `Delete PO ${Date.now()}`,
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 5,
          rate: 200,
        },
      ],
    };

    await purchaseOrderListPage.open();
    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    await purchaseOrderListPage.open();
    await purchaseOrderListPage.openFirstRecordForEdit();

    await expect(page).toHaveURL(/\/purchase-order\/\d+\/edit/);

    await purchaseOrderFormPage.deleteCurrent(process.env.PO_DELETE_REASON ?? 'Automated test cleanup');

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}`));
  });
});
