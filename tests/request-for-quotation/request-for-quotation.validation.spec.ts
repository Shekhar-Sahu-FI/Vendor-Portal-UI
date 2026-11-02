import { test } from '../../src/fixtures/test.fixture';
import { buildRfqValidationScenarios } from '../../src/pages/request-for-quotation/rfq-validation.scenarios';
import {
  assertAllPassed,
  publishFormCheckReport,
  runValidationScenario,
} from '../../src/utils/form-testing';
import type { ScenarioRunResult } from '../../src/utils/form-testing';

test.describe('Request for Quotation - Validation', () => {
  test('all required-field and format validations (single report)', async ({
    requestForQuotationListPage,
    requestForQuotationFormPage,
    page,
  }, testInfo) => {
    await requestForQuotationListPage.open();
    await requestForQuotationListPage.createNew();

    const scenarios = buildRfqValidationScenarios(requestForQuotationFormPage);
    const results: ScenarioRunResult[] = [];

    for (const scenario of scenarios) {
      try {
        await requestForQuotationFormPage.openNew();
        await runValidationScenario(page, {
          ...scenario,
          save: () => requestForQuotationFormPage.triggerSaveValidation(),
        });
        results.push({ name: scenario.name, status: 'pass' });
      } catch (error) {
        results.push({
          name: scenario.name,
          status: 'fail',
          detail: error instanceof Error ? error.message : String(error),
        });
      }
    }

    const report = await publishFormCheckReport(testInfo, 'RFQ Validation', results);
    assertAllPassed(results, report);
  });
});
