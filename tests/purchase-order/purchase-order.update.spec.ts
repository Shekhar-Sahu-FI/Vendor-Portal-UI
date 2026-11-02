import { test, expect } from '../../src/fixtures/test.fixture';
import { PurchaseOrderFillData } from '../../src/types/purchase-order.types';

test.describe('Purchase Order - Update (Direct Reference)', () => {
  const updatedRemarks = `Updated PO remarks ${Date.now()}`;

  test.beforeEach(async ({ purchaseOrderListPage, purchaseOrderFormPage }) => {
    const data: PurchaseOrderFillData = {
      company: { query: 'Bhilai', value: 'Bhilai Steel Plant' },
      division: { query: 'Plant', value: 'Plant Division' },
      documentType: { query: 'Urgent', value: 'Urgent' },
      expenditureType: { query: 'Capex', value: 'Capex' },
      referenceDocumentType: { query: 'Direct', value: 'Direct' },
      vendor: { query: 'Shekhar', value: 'Shekhar Enterprise' },
      validityDate: '2026-12-30',
      remarks: 'Initial PO remarks for update test',
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 10,
          rate: 500,
        },
      ],
    };

    await purchaseOrderListPage.open();
    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    await purchaseOrderListPage.open();
    await purchaseOrderListPage.openFirstRecordForEdit();
  });

  test('should update remarks on an existing direct reference purchase order (TC-PO-DIR-UPD-01)', async ({
    purchaseOrderFormPage,
    page,
  }) => {
    await expect(page).toHaveURL(/\/purchase-order\/\d+\/edit/);

    await purchaseOrderFormPage.updateRemarks(updatedRemarks);

    await expect(page).toHaveURL(/\/purchase-order\/\d+/);
  });
});
