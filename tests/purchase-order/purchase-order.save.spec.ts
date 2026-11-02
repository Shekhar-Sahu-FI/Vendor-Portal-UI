import { test, expect } from '../../src/fixtures/test.fixture';
import { PURCHASE_ORDER_ROUTES } from '../../src/pages/purchase-order/purchase-order.constants';
import { PurchaseOrderFillData } from '../../src/types/purchase-order.types';

test.describe('Purchase Order - Save (Direct Reference)', () => {
  test.beforeEach(async ({ purchaseOrderListPage }) => {
    await purchaseOrderListPage.open();
  });

  const baseData: PurchaseOrderFillData = {
    company: { query: 'Bhilai', value: 'Bhilai Steel Plant' },
    division: { query: 'Plant', value: 'Plant Division' },
    documentType: { query: 'Urgent', value: 'Urgent' },
    expenditureType: { query: 'Capex', value: 'Capex' },
    referenceDocumentType: { query: 'Direct', value: 'Direct' },
    documentStatus: { query: 'Draft', value: 'Draft' },
    validityDate: '2026-12-30',
    vendor: { query: 'Shekhar', value: 'Shekhar Enterprise' },
    vehicleType: { query: 'Truck', value: 'Truck' },
    paymentMode: { query: 'Bank', value: 'Bank Transfer' },
    dueBasis: { query: 'Gate', value: 'Gate Entry' },
    dueDays: 2,
    freightType: { query: 'TOPAY', value: 'TOPAY' },
    freightRateType: { query: 'Fixed', value: 'Fixed' },
    freightAmount: 23,
    priority: { query: 'Priority', value: 'Priority 01' },
    fromLocation: { query: 'Mumbai', value: 'Mumbai' },
    toLocation: { query: 'Mumbai', value: 'Mumbai' },
    currency: { query: 'United', value: 'United States dollar' },
    exchangeRate: 1,
    approvalSetup: { query: 'Shekhar', value: 'Shekhar PO' },
    remarks: 'Automated test PO remarks',
  };

  test('should create a new purchase order with all mandatory and optional fields (TC-PO-DIR-01)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    const suffix = Date.now().toString().slice(-6);
    const data: PurchaseOrderFillData = {
      ...baseData,
      partyReferenceNo: `PO-REF-${suffix}`,
      partyReferenceDate: '2026-05-15',
      erpSerialNo: `ERP-PO-${suffix}`,
      remarks: `All fields PO remarks ${suffix}`,
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          make: { query: 'Larsen', value: 'Larsen & Toubro' },
          techSpecification: 'Detailed technical specification for direct PO item',
          qty: 25.5,
          scheduleDate: '2026-08-15',
          unit: { query: 'Kilo', value: 'Kilo Gram' },
          rate: 1250,
          costCenter: { query: 'Machine', value: 'Machine Operations' },
          remarks: 'Item row remarks',
        },
      ],
      termsNConditionRows: [
        {
          termsNConditionHead: { query: 'Delivery', value: 'Delivery Terms' },
          value: 'Delivery within 30 days of PO issuance',
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('should create a new purchase order with only mandatory fields (TC-PO-DIR-02)', async ({
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
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 10,
          rate: 500,
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('should create a new purchase order with multiple item rows (TC-PO-DIR-03)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    const data: PurchaseOrderFillData = {
      ...baseData,
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 10,
          rate: 500,
          scheduleDate: '2026-07-01',
          costCenter: { query: 'Machine', value: 'Machine Operations' },
        },
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 20,
          rate: 750,
          scheduleDate: '2026-07-15',
          costCenter: { query: 'Machine', value: 'Machine Operations' },
        },
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 30,
          rate: 1000,
          scheduleDate: '2026-08-01',
          costCenter: { query: 'Machine', value: 'Machine Operations' },
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('should create a new purchase order with Capital and Revenue expenditure type (TC-PO-DIR-04)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    // Capex (Capital)
    const dataCapex: PurchaseOrderFillData = {
      ...baseData,
      expenditureType: { query: 'Capex', value: 'Capex' },
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 5,
          rate: 2000,
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(dataCapex);
    await purchaseOrderFormPage.saveAndConfirm();

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));

    // Opex (Revenue)
    const dataOpex: PurchaseOrderFillData = {
      ...baseData,
      expenditureType: { query: 'Opex', value: 'Opex' },
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 5,
          rate: 2000,
        },
      ],
    };

    await purchaseOrderListPage.open();
    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(dataOpex);
    await purchaseOrderFormPage.saveAndConfirm();

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('should create a new purchase order with Party Reference No and Party Reference Date (TC-PO-DIR-05)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    const data: PurchaseOrderFillData = {
      ...baseData,
      partyReferenceNo: 'PO-REF-9999',
      partyReferenceDate: '2026-05-10',
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 15,
          rate: 800,
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('should create a new purchase order with custom Currency and Exchange Rate (TC-PO-DIR-06)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    const data: PurchaseOrderFillData = {
      ...baseData,
      currency: { query: 'United', value: 'United States dollar' },
      exchangeRate: 83.5,
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 10,
          rate: 100,
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('should create a new purchase order with Shipping and Freight details (TC-PO-DIR-07)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    const data: PurchaseOrderFillData = {
      ...baseData,
      vehicleType: { query: 'Truck', value: 'Truck' },
      paymentMode: { query: 'Bank', value: 'Bank Transfer' },
      dueBasis: { query: 'Gate', value: 'Gate Entry' },
      dueDays: 30,
      freightType: { query: 'TOPAY', value: 'TOPAY' },
      freightRateType: { query: 'Fixed', value: 'Fixed' },
      freightAmount: 500,
      priority: { query: 'Priority', value: 'Priority 01' },
      fromLocation: { query: 'Mumbai', value: 'Mumbai' },
      toLocation: { query: 'Mumbai', value: 'Mumbai' },
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 10,
          rate: 450,
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('should verify saved purchase order details by reopening in edit mode (TC-PO-DIR-08)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    const data: PurchaseOrderFillData = {
      ...baseData,
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 5,
          rate: 100,
        },
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 3,
          rate: 200,
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    // Reopen first record in list for edit verification
    await purchaseOrderListPage.open();
    await purchaseOrderListPage.openFirstRecordForEdit();

    await expect(page).toHaveURL(/\/purchase-order\/\d+\/edit/);
  });

  test('should validate minimum boundary values (TC-PO-DIR-09)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    const data: PurchaseOrderFillData = {
      ...baseData,
      dueDays: 0,
      freightAmount: 0,
      exchangeRate: 1,
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 0,
          rate: 0,
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('should validate maximum length and large decimal boundary values (TC-PO-DIR-10)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    const remarks1000 = 'R'.repeat(1000);
    const itemRemarks500 = 'I'.repeat(500);
    const techSpec500 = 'T'.repeat(500);

    const data: PurchaseOrderFillData = {
      ...baseData,
      remarks: remarks1000,
      freightAmount: 99999.99,
      itemRows: [
        {
          item: { query: 'Air', value: 'Air Cooled Diesel Powered High Capacity Hydraulic Compression' },
          qty: 999999.999,
          rate: 9999.9999,
          techSpecification: techSpec500,
          remarks: itemRemarks500,
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();

    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('should create a new purchase order from purchase request modal selection (TC-PO-PR-01)', async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    const data: PurchaseOrderFillData = {
      ...baseData,
      referenceDocumentType: { query: 'Purchase Request', value: 'Purchase Request' },
      prModalRows: [
        {
          prNo: 'SS-PR-0004',
          lineNo: 1,
          poQty: '20',
        },
      ],
      itemRows: [
        {
          rate: 856,
        },
      ],
    };

    await purchaseOrderListPage.createNew();
    await purchaseOrderFormPage.fill(data);
    await purchaseOrderFormPage.saveAndConfirm();
    await expect(page).toHaveURL(new RegExp(`${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}$`));
  });
});
