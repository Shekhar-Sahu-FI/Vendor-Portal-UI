/** Auto-suggestion field: type query, select value */
export interface AutoSuggestField {
  query: string;
  value: string;
}

export interface SelectField {
  query?: string;
  value: string;
}

export interface PurchaseOrderItemRowData {
  item?: AutoSuggestField;
  hsnCode?: string;
  make?: AutoSuggestField;
  techSpecification?: string;
  qty?: string | number;
  grnProcessQty?: number;
  unit?: AutoSuggestField;
  scheduleDate?: string;
  rate?: string | number;
  tolerancePlus?: number;
  toleranceMinus?: number;
  remarks?: string;
  costCenter?: AutoSuggestField;
  itemTaxRows?: Array<{
    tax?: SelectField;
    chargeType?: SelectField;
    nature?: SelectField;
    chargeOn?: SelectField;
    chargeValue?: number;
    amount?: number;
  }>;
}

export interface PurchaseOrderPrModalRowData {
  rowIndex?: number;
  prNo?: string;
  lineNo?: string | number;
  selected?: boolean;
  poQty?: string;
  poMake?: AutoSuggestField;
  poUnit?: AutoSuggestField;
}

/**
 * Flat fill payload for Purchase Order form (all commonly used sections).
 * Each field is optional and only provided values are filled.
 */
export interface PurchaseOrderFillData {
  company?: AutoSuggestField;
  division?: AutoSuggestField;
  documentType?: AutoSuggestField;
  documentDate?: string;
  documentNo?: string;
  documentStatus?: string | SelectField;

  expenditureType?: string | SelectField;
  referenceDocumentType?: string | SelectField;
  referenceDocumentTypeId?: number;
  referenceDocumentNo?: string;
  vendor?: AutoSuggestField;
  vendorLocation?: AutoSuggestField;
  contactPerson?: AutoSuggestField;
  validityDate?: string;
  department?: AutoSuggestField;
  partyReferenceNo?: string;
  partyReferenceDate?: string;
  erpSerialNo?: string;
  remarks?: string;

  vehicleType?: SelectField;
  paymentMode?: SelectField;
  dueBasis?: SelectField;
  dueDays?: number;
  freightType?: SelectField;
  freightRateType?: SelectField;
  freightAmount?: number;
  priority?: AutoSuggestField;
  fromLocation?: AutoSuggestField;
  toLocation?: AutoSuggestField;
  consigneeLocation?: AutoSuggestField;
  currency?: SelectField;
  exchangeRate?: number;
  tncGroup?: AutoSuggestField;
  approvalSetup?: AutoSuggestField;

  itemRows?: PurchaseOrderItemRowData[];
  prModalRows?: PurchaseOrderPrModalRowData[];
  termsNConditionRows?: Array<{
    termsNConditionHead?: AutoSuggestField;
    value?: string;
  }>;
}
