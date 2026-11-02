import type { ValidationScenario } from '../../utils/form-testing';
import type { RequestForQuotationFormPage } from './request-for-quotation-form.page';
import {
  DOCUMENT_DETAIL_LABELS,
  GENERAL_DETAIL_LABELS,
  REQUEST_FOR_QUOTATION_ROUTES,
} from './request-for-quotation.constants';
import { RFQ_VALIDATION_MESSAGES as MSG } from './rfq-validation.messages';
import { fillDateByLabel } from '../../utils/date-calendar.helper';
import { fillTextField } from '../../utils/field-accessor';
import { rfqPortalSettingsFromEnv } from '../../utils/portal-settings.helper';

const stayOnNew = new RegExp(`${REQUEST_FOR_QUOTATION_ROUTES.new().replace(/\//g, '\\/')}$`);

export function buildRfqValidationScenarios(form: RequestForQuotationFormPage): ValidationScenario[] {
  const save = () => form.triggerSaveValidation();

  const scenarios: ValidationScenario[] = [
    {
      name: 'empty Direct form',
      setup: async () => form.fillSourceDocumentDirect(),
      save,
      stayOnUrl: stayOnNew,
      expect: {
        messages: [MSG.documentTypeRequired, MSG.dueDateRequired],
        gridSummary: [MSG.atLeastOneItem, MSG.atLeastOneVendor],
      },
    },
    {
      name: 'invalid contact email',
      setup: async ({ page }) => fillTextField(page, GENERAL_DETAIL_LABELS.contactEmail, 'bad-email'),
      save,
      stayOnUrl: stayOnNew,
      expect: {
        fields: [{ label: GENERAL_DETAIL_LABELS.contactEmail, message: MSG.contactEmailInvalid }],
      },
    },
    {
      name: 'due date before document date',
      setup: async ({ page }) => {
        await fillDateByLabel(page, DOCUMENT_DETAIL_LABELS.documentDate, '2026-06-15');
        await fillDateByLabel(page, GENERAL_DETAIL_LABELS.dueDate, '2026-06-01');
      },
      save,
      stayOnUrl: stayOnNew,
      expect: {
        fields: [{ label: GENERAL_DETAIL_LABELS.dueDate, message: MSG.dueDateBeforeDocDate }],
      },
    },
    {
      name: 'partial item row',
      setup: async ({ page }) => {
        await form.documentDetail.fillAll({ documentType: { query: 'RProcess', value: 'RProcess' } });
        await fillDateByLabel(page, GENERAL_DETAIL_LABELS.dueDate, '2026-12-31');
        await form.itemDetail.fillRow(0, {
          item: { query: 'cold', value: 'cold rolled sheets' },
          make: { query: 'Larsen', value: 'Larsen & Toubro' },
        });
      },
      save,
      stayOnUrl: stayOnNew,
      expect: {
        gridCells: [
          { row: 0, columnId: 'unitCode', message: MSG.unitRequired(1) },
          { row: 0, columnId: 'qty', message: MSG.qtyGreaterThanZero(1) },
        ],
        gridSummary: [MSG.atLeastOneVendor],
      },
    },
    {
      name: 'partial vendor row',
      setup: async ({ page }) => {
        await form.documentDetail.fillAll({ documentType: { query: 'RProcess', value: 'RProcess' } });
        await fillDateByLabel(page, GENERAL_DETAIL_LABELS.dueDate, '2026-12-31');
        await form.itemDetail.fillRow(0, {
          item: { query: 'cold', value: 'cold rolled sheets' },
          make: { query: 'Larsen', value: 'Larsen & Toubro' },
          unit: { query: 'METRIC', value: 'METRIC TON' },
          qty: '10',
        });
        await form.vendorDetail.fillRow(0, {
          vendor: { query: 'Force', value: 'Force Intellect Private limited' },
        });
      },
      save,
      stayOnUrl: stayOnNew,
      expect: {
        gridCells: [{ row: 0, columnId: 'vendorLocationName', message: MSG.vendorLocationRequired(1) }],
      },
    },
    {
      name: 'PR source without items',
      setup: async ({ page }) => {
        await form.fillSourceDocumentPurchaseRequest();
        await form.documentDetail.fillAll({ documentType: { query: 'RProcess', value: 'RProcess' } });
        await fillDateByLabel(page, GENERAL_DETAIL_LABELS.dueDate, '2026-12-31');
      },
      save,
      stayOnUrl: stayOnNew,
      expect: {
        gridSummary: [MSG.atLeastOneItem, MSG.atLeastOneVendor],
      },
    },
  ];

  const portal = rfqPortalSettingsFromEnv();
  if (portal.isRfqItemMakeRequired) {
    scenarios.push({
      name: 'portal: make required',
      setup: async ({ page }) => {
        await form.documentDetail.fillAll({ documentType: { query: 'RProcess', value: 'RProcess' } });
        await fillDateByLabel(page, GENERAL_DETAIL_LABELS.dueDate, '2026-12-31');
        await form.itemDetail.fillRow(0, {
          item: { query: 'cold', value: 'cold rolled sheets' },
          unit: { query: 'METRIC', value: 'METRIC TON' },
          qty: '10',
        });
        await form.vendorDetail.fillRow(0, {
          vendor: { query: 'Force', value: 'Force Intellect Private limited' },
          vendorLocation: { query: 'Room', value: 'Room No. 6 STPI Nehru Nagar' },
        });
      },
      save,
      stayOnUrl: stayOnNew,
      expect: { gridCells: [{ row: 0, columnId: 'makeName', message: MSG.makeRequired(1) }] },
    });
  }

  if (portal.isRfqItemTechSpecRequired) {
    scenarios.push({
      name: 'portal: tech spec required',
      setup: async ({ page }) => {
        await form.documentDetail.fillAll({ documentType: { query: 'RProcess', value: 'RProcess' } });
        await fillDateByLabel(page, GENERAL_DETAIL_LABELS.dueDate, '2026-12-31');
        await form.itemDetail.fillRow(0, {
          item: { query: 'cold', value: 'cold rolled sheets' },
          make: { query: 'Larsen', value: 'Larsen & Toubro' },
          unit: { query: 'METRIC', value: 'METRIC TON' },
          qty: '10',
        });
        await form.vendorDetail.fillRow(0, {
          vendor: { query: 'Force', value: 'Force Intellect Private limited' },
          vendorLocation: { query: 'Room', value: 'Room No. 6 STPI Nehru Nagar' },
        });
      },
      save,
      stayOnUrl: stayOnNew,
      expect: {
        gridCells: [{ row: 0, columnId: 'techSpecification', message: MSG.techSpecRequired(1) }],
      },
    });
  }

  return scenarios;
}
