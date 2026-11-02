import { PurchaseOrderFillData } from '../../types/purchase-order.types';

const uniqueSuffix = () => Date.now().toString().slice(-6);

export function buildPurchaseOrderData(
  overrides: Partial<PurchaseOrderFillData> = {},
): PurchaseOrderFillData {
  const suffix = uniqueSuffix();

  const defaults: PurchaseOrderFillData = {
    company: envField('PO_COMPANY_SEARCH', 'PO_COMPANY_SELECT', 'Bhilai', 'Bhilai Steel Plant'),
    division: envField('PO_DIVISION_SEARCH', 'PO_DIVISION_SELECT', 'Plant', 'Plant Division'),
    documentType: envField('PO_DOC_TYPE_SEARCH', 'PO_DOC_TYPE_SELECT', 'Local', 'Local'),
    documentDate: process.env.PO_DOC_DATE ?? '2026-05-28',
    expenditureType: process.env.PO_EXPENDITURE_TYPE ?? 'Capex',
    referenceDocumentTypeId: 10,
    vendor: envField('PO_VENDOR_SEARCH', 'PO_VENDOR_SELECT', 'supply', 'Supply One Vendor'),
    vendorLocation: envField('PO_VENDOR_LOCATION_SEARCH', 'PO_VENDOR_LOCATION_SELECT', 'plant', 'Plant Location'),
    validityDate: process.env.PO_VALIDITY_DATE ?? '2026-06-30',
    erpSerialNo: process.env.PO_ERP_SERIAL_NO ?? 'PO-001',
    partyReferenceNo: process.env.PO_PARTY_REFERENCE_NO ?? `PO/REF/${suffix}`,
    partyReferenceDate: process.env.PO_PARTY_REFERENCE_DATE ?? '2026-05-28',
    remarks: process.env.PO_REMARKS ?? `Auto PO remarks ${suffix}`,
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
