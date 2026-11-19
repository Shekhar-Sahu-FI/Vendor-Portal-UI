import { PurchaseRequestFillData } from '../../types/purchase-request.types';

const uniqueSuffix = () => Date.now().toString().slice(-6);

export function buildPurchaseRequestData(
  overrides: Partial<PurchaseRequestFillData> = {},
): PurchaseRequestFillData {
  const suffix = uniqueSuffix();

  const defaults: PurchaseRequestFillData = {
    company: envField('PR_COMPANY_SEARCH', 'PR_COMPANY_SELECT', 'Company One', 'Company One'),
    division: envField('PR_DIVISION_SEARCH', 'PR_DIVISION_SELECT', 'Division One', 'Division One Company One Two Three'),
    documentType: envField('PR_DOC_TYPE_SEARCH', 'PR_DOC_TYPE_SELECT', 'PR - Standard', 'PR - Standard - Division One Company One Two Three'),
    documentDate: process.env.PR_DOC_DATE ?? '2026-06-15',
    department: envField('PR_DEPARTMENT_SEARCH', 'PR_DEPARTMENT_SELECT', 'Department One', 'Department One Division One Two Three'),
    requestedBy: envField('PR_REQUESTED_BY', 'PR_REQUESTED_BY_SELECT', 'UN2', 'UN2'),
    requestedContactNo: { countrySearch: 'India', localNumber: '9876500002' },
    requestedByEmail: 'rajesh.verma@shaktiindustrial.com',
    expenditureType: process.env.PR_EXPENDITURE_TYPE ?? 'Capex',
    referenceNo: process.env.PR_REFERENCE_NO ?? `REF-${suffix}`,
    referenceDate: process.env.PR_REFERENCE_DATE ?? '2026-06-10',
    remarks: process.env.PR_REMARKS ?? `Auto PR remarks ${suffix}`,
    itemRows: [
      {
        item: envField('PR_ITEM_NAME', 'PR_ITEM_NAME_SELECT', 'Item One', 'Item One No Multi Unit No Make'),
        requiredQty: process.env.PR_REQUIRED_QTY ?? '100',
        prQty: process.env.PR_QTY ?? '100',
        rate: process.env.PR_RATE ?? '1',
        remarks: process.env.PR_ITEM_REMARKS ?? 'Item One remarks',
        techSpecification:
          process.env.PR_TECH_SPEC ??
          'Technical specification for Item One',
        scheduleDate: process.env.PR_SCHEDULE_DATE ?? '2026-10-28',
        priority: envField('PR_PRIORITY_SEARCH', 'PR_PRIORITY_SELECT', 'Priority One', 'Priority One'),
        costCenter: envField('PR_COST_CENTER_SEARCH', 'PR_COST_CENTER_SELECT', 'Cost Center One', 'Cost Center One'),
      },
    ],
    informToRows: [
      { query: 'UN1', value: 'UN1' },
      { query: 'UN3', value: 'UN3' },
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
