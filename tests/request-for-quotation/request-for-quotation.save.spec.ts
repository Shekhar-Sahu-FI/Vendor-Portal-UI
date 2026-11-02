import { test, expect } from '../../src/fixtures/test.fixture';
import { REQUEST_FOR_QUOTATION_ROUTES } from '../../src/pages/request-for-quotation/request-for-quotation.constants';
import {
  buildDirectRfqData,
  buildPurchaseRequestRfqData,
} from '../../src/utils/test-data/request-for-quotation.factory';

test.describe('Request for Quotation - Save', () => {
  test.beforeEach(async ({ requestForQuotationListPage }) => {
    await requestForQuotationListPage.open();
  });

  test('should create a new RFQ with Direct source document', async ({
    requestForQuotationListPage,
    requestForQuotationFormPage,
    page,
  }) => {
    const data = buildDirectRfqData();

    await requestForQuotationListPage.createNew();
    await requestForQuotationFormPage.fill(data);
    await requestForQuotationFormPage.saveAndConfirm();

    await expect(page).toHaveURL(
      new RegExp(`${REQUEST_FOR_QUOTATION_ROUTES.list().replace(/\//g, '\\/')}$`),
    );
  });

  test('should create a new RFQ from Purchase Request source document', async ({
    requestForQuotationListPage,
    requestForQuotationFormPage,
    page,
  }) => {
    // Based on RFQ/00092 (id 197) — refDocType Purchase Request, PR SS-PR-0007
    const data = buildPurchaseRequestRfqData();
    console.log(data);

    await requestForQuotationListPage.createNew();
    await requestForQuotationFormPage.fill(data);
    await requestForQuotationFormPage.saveAndConfirm();

    await expect(page).toHaveURL(
      new RegExp(`${REQUEST_FOR_QUOTATION_ROUTES.list().replace(/\//g, '\\/')}$`),
    );
  });
});
