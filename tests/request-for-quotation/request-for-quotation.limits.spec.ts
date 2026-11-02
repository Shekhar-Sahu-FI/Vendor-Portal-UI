import { test } from '../../src/fixtures/test.fixture';
import { RFQ_LIMIT_CHECKS } from '../../src/pages/request-for-quotation/rfq-form.checks';
import {
  assertAllPassed,
  publishFormCheckReport,
  runLimitChecks,
} from '../../src/utils/form-testing';

test.describe('Request for Quotation - Field limits', () => {
  test('all field max-length and numeric limits (single report)', async ({
    requestForQuotationListPage,
    requestForQuotationFormPage,
    page,
  }, testInfo) => {
    await requestForQuotationListPage.open();
    await requestForQuotationListPage.createNew();
    await requestForQuotationFormPage.openNew();
    await requestForQuotationFormPage.fillSourceDocumentDirect();
    await requestForQuotationFormPage.documentDetail.fillAll({
      documentType: { query: 'RProcess', value: 'RProcess' },
    });
    await requestForQuotationFormPage.itemDetail.fillRow(0, {
      item: { query: 'cold', value: 'cold rolled sheets' },
    });

    const results = await runLimitChecks(RFQ_LIMIT_CHECKS, {
      page,
      triggerSave: () => requestForQuotationFormPage.triggerSaveValidation(),
    });

    const report = await publishFormCheckReport(testInfo, 'RFQ Field Limits', results);
    assertAllPassed(results, report);
  });
});
