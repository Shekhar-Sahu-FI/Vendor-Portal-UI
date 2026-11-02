import { PurchaseRequestFillData } from '../../types/purchase-request.types';

const uniqueSuffix = () => Date.now().toString().slice(-6);

export function buildPurchaseRequestData(
  overrides: Partial<PurchaseRequestFillData> = {},
): PurchaseRequestFillData {
  const suffix = uniqueSuffix();

  const defaults: PurchaseRequestFillData = {
    company: envField('PR_COMPANY_SEARCH', 'PR_COMPANY_SELECT', 'Bhilai', 'Bhilai Steel Plant'),
    division: envField('PR_DIVISION_SEARCH', 'PR_DIVISION_SELECT', 'Plant', 'Plant Division'),
    documentType: envField('PR_DOC_TYPE_SEARCH', 'PR_DOC_TYPE_SELECT', 'Process', 'Process'),
    documentDate: process.env.PR_DOC_DATE ?? '2026-05-06',
    department: envField('PR_DEPARTMENT_SEARCH', 'PR_DEPARTMENT_SELECT', 'Purchase', 'Purchase'),
    requestedBy: envField('PR_REQUESTED_BY', 'PR_REQUESTED_BY_SELECT', 'sai', 'sai-ui'),
    expenditureType: process.env.PR_EXPENDITURE_TYPE ?? 'Capex',
    erpSerialNo: process.env.PR_ERP_SERIAL_NO ?? 'PR-001',
    referenceNo: process.env.PR_REFERENCE_NO ?? `PR/BSP/PLT/PRC/${suffix}`,
    referenceDate: process.env.PR_REFERENCE_DATE ?? '2026-04-17',
    remarks: process.env.PR_REMARKS ?? `Auto PR remarks ${suffix}`,
    itemRows: [
      {
        item: envField('PR_ITEM_NAME', 'PR_ITEM_NAME_SELECT', 'I-beams', 'I-beams'),
        requiredQty: process.env.PR_REQUIRED_QTY ?? '100',
        prQty: process.env.PR_QTY ?? '100',
        rate: process.env.PR_RATE ?? '1',
        remarks: process.env.PR_ITEM_REMARKS ?? 'BEam shaping',
        techSpecification:
          process.env.PR_TECH_SPEC ??
          'I-beams are used for construction of buildings and bridges',
        scheduleDate: process.env.PR_SCHEDULE_DATE ?? '2026-05-28',
        priority: envField('PR_PRIORITY_SEARCH', 'PR_PRIORITY_SELECT', 'high', 'Very High'),
        costCenter: envField('PR_COST_CENTER_SEARCH', 'PR_COST_CENTER_SELECT', 'Machine', 'Machine Operations'),
      },
    ],
    informToRows: [
      { query: 'sai', value: 'sai ui' },
      { query: 'Bhargav', value: 'Bhargav' },
    ],
  };

  return { ...defaults, ...overrides };
}

function envField(
  queryKey: string,
  valueKey: string,
  defaultQuery: string,
  defaultValue: string,
) {
  const query = process.env[queryKey];
  const value = process.env[valueKey];
  if (!query && !value) {
    return { query: defaultQuery, value: defaultValue };
  }
  return { query: query ?? defaultQuery, value: value ?? defaultValue };
}
