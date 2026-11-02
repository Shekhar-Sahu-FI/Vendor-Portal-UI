import type { ContactNumberFill } from '../utils/contact-number.helper';

/** Auto-suggestion field: type query, select value */
export interface AutoSuggestField {
  query: string;
  value: string;
}

export interface PurchaseRequestItemRowData {
  item?: AutoSuggestField;
  requiredQty?: string;
  prQty?: string;
  rate?: string;
  remarks?: string;
  techSpecification?: string;
  scheduleDate?: string;
  priority?: AutoSuggestField;
  costCenter?: AutoSuggestField;
}

/**
 * Flat fill payload for Purchase Request form (all sections).
 * Each field is optional — only provided values are filled.
 */
export interface PurchaseRequestFillData {
  company?: AutoSuggestField;
  division?: AutoSuggestField;
  documentType?: AutoSuggestField;
  documentDate?: string;
  documentNo?: string;
  documentStatus?: string;

  department?: AutoSuggestField;
  requestedBy?: AutoSuggestField;
  requestedByEmail?: string;
  /** `ContactNumberInput` — country search + local digits, or local digits only. */
  requestedContactNo?: string | ContactNumberFill;
  expenditureType?: string;
  erpSerialNo?: string;
  referenceNo?: string;
  referenceDate?: string;
  remarks?: string;

  itemRows?: PurchaseRequestItemRowData[];
  informToRows?: AutoSuggestField[];
}

/** @deprecated Use PurchaseRequestFillData */
export type PurchaseRequestTestData = PurchaseRequestFillData;

export interface PurchaseRequestRecord {
  id: number;
  docNoYearly?: string;
  remarks?: string;
}
