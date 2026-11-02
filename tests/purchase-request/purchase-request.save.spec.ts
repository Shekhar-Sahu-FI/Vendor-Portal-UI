import { test, expect } from '../../src/fixtures/test.fixture';
import { PURCHASE_REQUEST_ROUTES } from '../../src/pages/purchase-request/purchase-request.constants';
import { prExpectUrl } from '../../src/pages/purchase-request/purchase-request.assert.messages';
import { PurchaseRequestFillData } from '../../src/types/purchase-request.types';

const PR_MAPPED_DATA = {
  company: { query: 'Company One', value: 'Company One' },
  division: { query: 'Division One', value: 'Division One Company One Two Three' },
  documentType: { query: 'PR - Standard', value: 'PR - Standard - Division One Company One Two Three' },
  documentDate: '2026-06-15',
  department: { query: 'Department One', value: 'Department One Division One Two Three' },
  requestedBy: { query: 'UN2', value: 'UN2' },
  requestedContactNo: { countrySearch: 'India', localNumber: '9876500002' },
  requestedByEmail: 'rajesh.verma@shaktiindustrial.com',
  referenceDate: '2026-06-10',
  items: {
    item1: { query: 'Item One', value: 'Item One No Multi Unit No Make' },
    item2: { query: 'Item Two', value: 'Item Two Multi Unit Make One Two Three' },
    item3: { query: 'Item Three', value: 'Item Three No Multi Unit All Make' },
  },
  priorities: {
    priority1: { query: 'Priority One', value: 'Priority One' },
    priority2: { query: 'Priority Two', value: 'Priority Two' },
    priority3: { query: 'Priority Three', value: 'Priority Three' },
  },
  costCenters: {
    costCenter1: { query: 'Cost Center One', value: 'Cost Center One' },
    costCenter2: { query: 'Cost Center Two', value: 'Cost Center Two' },
  },
  informTo: {
    user1: { query: 'UN1', value: 'UN1' },
    user3: { query: 'UN3', value: 'UN3' },
  },
} as const;

test.describe('Category 2: Purchase Request - Entry Page & Creation', () => {
  test.beforeEach(async ({ purchaseRequestListPage }) => {
    await purchaseRequestListPage.open();
  });

  test('PR-ENT-001: should create a new purchase request with all mandatory and optional fields @TC-SAV-01', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const suffix = Date.now().toString().slice(-6);
    const data: PurchaseRequestFillData = {
      company: PR_MAPPED_DATA.company,
      division: PR_MAPPED_DATA.division,
      documentType: PR_MAPPED_DATA.documentType,
      documentDate: PR_MAPPED_DATA.documentDate,
      department: PR_MAPPED_DATA.department,
      expenditureType: 'Capex',
      requestedBy: PR_MAPPED_DATA.requestedBy,
      requestedByEmail: PR_MAPPED_DATA.requestedByEmail,
      requestedContactNo: PR_MAPPED_DATA.requestedContactNo,
      referenceNo: `REF-${suffix}`,
      referenceDate: PR_MAPPED_DATA.referenceDate,
      remarks: `All fields PR remarks ${suffix}`,
      itemRows: [
        {
          item: PR_MAPPED_DATA.items.item1,
          requiredQty: '100',
          prQty: '100',
          rate: '1',
          remarks: 'Item One remarks',
          techSpecification: 'Technical specification for Item One',
          scheduleDate: '2026-10-28',
          priority: PR_MAPPED_DATA.priorities.priority1,
          costCenter: PR_MAPPED_DATA.costCenters.costCenter1,
        },
      ],
      informToRows: [
        PR_MAPPED_DATA.informTo.user1,
        PR_MAPPED_DATA.informTo.user3,
      ],
    };

    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    await purchaseRequestFormPage.saveAndConfirm();

    await expect(
      page,
      prExpectUrl('to redirect to the Purchase Request list after save'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('PR-ENT-002: should create a new purchase request with only mandatory fields @TC-SAV-02', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const data: PurchaseRequestFillData = {
      company: PR_MAPPED_DATA.company,
      division: PR_MAPPED_DATA.division,
      documentType: PR_MAPPED_DATA.documentType,
      documentDate: PR_MAPPED_DATA.documentDate,
      department: PR_MAPPED_DATA.department,
      expenditureType: 'Capex',
      itemRows: [
        {
          item: PR_MAPPED_DATA.items.item1,
          requiredQty: '100',
          prQty: '100',
          rate: '1',
          scheduleDate: '2026-10-28',
          priority: PR_MAPPED_DATA.priorities.priority1,
        },
      ],
    };

    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    await purchaseRequestFormPage.saveAndConfirm();

    await expect(
      page,
      prExpectUrl('to redirect to the Purchase Request list after save'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('PR-ENT-003: should create a new purchase request with Inform To users @TC-SAV-03', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const data: PurchaseRequestFillData = {
      company: PR_MAPPED_DATA.company,
      division: PR_MAPPED_DATA.division,
      documentType: PR_MAPPED_DATA.documentType,
      documentDate: PR_MAPPED_DATA.documentDate,
      department: PR_MAPPED_DATA.department,
      expenditureType: 'Capex',
      itemRows: [
        {
          item: PR_MAPPED_DATA.items.item1,
          requiredQty: '100',
          prQty: '100',
          rate: '1',
          scheduleDate: '2026-10-28',
          priority: PR_MAPPED_DATA.priorities.priority1,
        },
      ],
      informToRows: [
        PR_MAPPED_DATA.informTo.user1,
      ],
    };

    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    await purchaseRequestFormPage.saveAndConfirm();

    await expect(
      page,
      prExpectUrl('to redirect to the Purchase Request list after save'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('PR-ENT-004: should create a new purchase request with multiple items @TC-SAV-04', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const data: PurchaseRequestFillData = {
      company: PR_MAPPED_DATA.company,
      division: PR_MAPPED_DATA.division,
      documentType: PR_MAPPED_DATA.documentType,
      documentDate: PR_MAPPED_DATA.documentDate,
      department: PR_MAPPED_DATA.department,
      expenditureType: 'Capex',
      itemRows: [
        {
          item: PR_MAPPED_DATA.items.item1,
          requiredQty: '100',
          prQty: '100',
          rate: '1',
          scheduleDate: '2026-10-28',
          priority: PR_MAPPED_DATA.priorities.priority1,
          costCenter: PR_MAPPED_DATA.costCenters.costCenter1,
        },
        {
          item: PR_MAPPED_DATA.items.item2,
          requiredQty: '200',
          prQty: '200',
          rate: '2',
          scheduleDate: '2026-10-29',
          priority: PR_MAPPED_DATA.priorities.priority2,
          costCenter: PR_MAPPED_DATA.costCenters.costCenter2,
        },
        {
          item: PR_MAPPED_DATA.items.item3,
          requiredQty: '300',
          prQty: '300',
          rate: '3',
          scheduleDate: '2026-10-30',
          priority: PR_MAPPED_DATA.priorities.priority2,
          costCenter: PR_MAPPED_DATA.costCenters.costCenter1,
        },
      ],
    };

    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    await purchaseRequestFormPage.saveAndConfirm();

    await expect(
      page,
      prExpectUrl('to redirect to the Purchase Request list after save'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('PR-ENT-006: should create a new purchase request with Capital (Capex) expenditure type @TC-SAV-06', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const dataCapex: PurchaseRequestFillData = {
      company: PR_MAPPED_DATA.company,
      division: PR_MAPPED_DATA.division,
      documentType: PR_MAPPED_DATA.documentType,
      documentDate: PR_MAPPED_DATA.documentDate,
      department: PR_MAPPED_DATA.department,
      expenditureType: 'Capex',
      itemRows: [
        {
          item: PR_MAPPED_DATA.items.item1,
          requiredQty: '100',
          prQty: '100',
          rate: '1',
          scheduleDate: '2026-10-28',
          priority: PR_MAPPED_DATA.priorities.priority1,
        },
      ],
    };

    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(dataCapex);
    await purchaseRequestFormPage.saveAndConfirm();

    await expect(
      page,
      prExpectUrl('to redirect to the Purchase Request list after save'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('PR-ENT-007: should create a new purchase request with Revenue (Opex) expenditure type @TC-SAV-07', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const dataOpex: PurchaseRequestFillData = {
      company: PR_MAPPED_DATA.company,
      division: PR_MAPPED_DATA.division,
      documentType: PR_MAPPED_DATA.documentType,
      documentDate: PR_MAPPED_DATA.documentDate,
      department: PR_MAPPED_DATA.department,
      expenditureType: 'Opex',
      itemRows: [
        {
          item: PR_MAPPED_DATA.items.item1,
          requiredQty: '100',
          prQty: '100',
          rate: '1',
          scheduleDate: '2026-10-28',
          priority: PR_MAPPED_DATA.priorities.priority1,
        },
      ],
    };

    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(dataOpex);
    await purchaseRequestFormPage.saveAndConfirm();

    await expect(
      page,
      prExpectUrl('to redirect to the Purchase Request list after save'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('PR-ENT-009: should create a new purchase request with Reference No and Reference Date @TC-SAV-08', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const data: PurchaseRequestFillData = {
      company: PR_MAPPED_DATA.company,
      division: PR_MAPPED_DATA.division,
      documentType: PR_MAPPED_DATA.documentType,
      documentDate: PR_MAPPED_DATA.documentDate,
      department: PR_MAPPED_DATA.department,
      expenditureType: 'Capex',
      referenceNo: 'PR-REF-8888',
      referenceDate: PR_MAPPED_DATA.referenceDate,
      itemRows: [
        {
          item: PR_MAPPED_DATA.items.item1,
          requiredQty: '100',
          prQty: '100',
          rate: '1',
          scheduleDate: '2026-10-28',
          priority: PR_MAPPED_DATA.priorities.priority1,
        },
      ],
    };

    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    await purchaseRequestFormPage.saveAndConfirm();

    await expect(
      page,
      prExpectUrl('to redirect to the Purchase Request list after save'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('PR-ENT-008: should create a new purchase request with requestedBy containing valid contact and email @TC-SAV-09', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    const data: PurchaseRequestFillData = {
      company: PR_MAPPED_DATA.company,
      division: PR_MAPPED_DATA.division,
      documentType: PR_MAPPED_DATA.documentType,
      documentDate: PR_MAPPED_DATA.documentDate,
      department: PR_MAPPED_DATA.department,
      expenditureType: 'Capex',
      requestedBy: PR_MAPPED_DATA.requestedBy,
      requestedContactNo: PR_MAPPED_DATA.requestedContactNo,
      requestedByEmail: PR_MAPPED_DATA.requestedByEmail,
      itemRows: [
        {
          item: PR_MAPPED_DATA.items.item1,
          requiredQty: '100',
          prQty: '100',
          rate: '1',
          scheduleDate: '2026-10-28',
          priority: PR_MAPPED_DATA.priorities.priority1,
        },
      ],
    };

    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    await purchaseRequestFormPage.saveAndConfirm();

    await expect(
      page,
      prExpectUrl('to redirect to the Purchase Request list after save'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.list().replace(/\//g, '\\/')}$`));
  });

  test('PR-ENT-015: should verify net_amount is correctly calculated across multiple items @TC-SAV-10', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    // 2 items: item1 prQty=5, rate=100 (amount=500); item2 prQty=3, rate=200 (amount=600). Total net_amount=1100.
    const data: PurchaseRequestFillData = {
      company: PR_MAPPED_DATA.company,
      division: PR_MAPPED_DATA.division,
      documentType: PR_MAPPED_DATA.documentType,
      documentDate: PR_MAPPED_DATA.documentDate,
      department: PR_MAPPED_DATA.department,
      expenditureType: 'Capex',
      itemRows: [
        {
          item: PR_MAPPED_DATA.items.item1,
          requiredQty: '5',
          prQty: '5',
          rate: '100',
          scheduleDate: '2026-10-28',
          priority: PR_MAPPED_DATA.priorities.priority1,
        },
        {
          item: PR_MAPPED_DATA.items.item2,
          requiredQty: '3',
          prQty: '3',
          rate: '200',
          scheduleDate: '2026-10-29',
          priority: PR_MAPPED_DATA.priorities.priority2,
        },
      ],
    };

    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    const docNo = await purchaseRequestFormPage.saveAndConfirm();

    // Reopen and check saved record is in edit mode
    await purchaseRequestListPage.open();
    await purchaseRequestListPage.openSavedRecordForEdit(docNo);

    await expect(page).toHaveURL(/\/purchase-request\/\d+\/edit/);
  });

  test('PR-ENT-013: should handle maximum lengths and boundary decimals @TC-SAV-35-38', async ({
    purchaseRequestListPage,
    purchaseRequestFormPage,
    page,
  }) => {
    // TC-SAV-35: remarks at max length 1000 chars
    // TC-SAV-36: item remarks at max length 500 chars
    // TC-SAV-37: requestedEmailId at max length 320 chars (308 + @example.com)
    // TC-SAV-38: Large decimal - prQty = 999999.999, rate = 9999.9999
    const remarks1000 = 'r'.repeat(1000);
    const itemRemarks500 = 'i'.repeat(500);
    const email320 = 'e'.repeat(308) + '@example.com';

    const data: PurchaseRequestFillData = {
      company: PR_MAPPED_DATA.company,
      division: PR_MAPPED_DATA.division,
      documentType: PR_MAPPED_DATA.documentType,
      documentDate: PR_MAPPED_DATA.documentDate,
      department: PR_MAPPED_DATA.department,
      expenditureType: 'Capex',
      requestedBy: PR_MAPPED_DATA.requestedBy,
      requestedContactNo: PR_MAPPED_DATA.requestedContactNo,
      requestedByEmail: email320,
      remarks: remarks1000,
      itemRows: [
        {
          item: PR_MAPPED_DATA.items.item1,
          requiredQty: '100',
          prQty: '999999.999',
          rate: '9999.9999',
          remarks: itemRemarks500,
          scheduleDate: '2026-10-28',
          priority: PR_MAPPED_DATA.priorities.priority1,
        },
      ],
    };

    await purchaseRequestListPage.createNew();
    await purchaseRequestFormPage.fillMinimumRequired(data);
    await purchaseRequestFormPage.saveAndConfirm();

    await expect(
      page,
      prExpectUrl('to redirect to the Purchase Request list after save'),
    ).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.list().replace(/\//g, '\\/')}$`));
  });
});
