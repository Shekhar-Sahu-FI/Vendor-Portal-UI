import { AutoSuggestField, SelectField } from './purchase-order.types';

export type RfqSourceDocumentType = 'direct' | 'purchaseRequest';

export interface RequestForQuotationItemRowData {
  item?: AutoSuggestField;
  make?: AutoSuggestField;
  unit?: AutoSuggestField;
  techSpecification?: string;
  qty?: string | number;
  remarks?: string;
  /** File name under playwright/test-assets (item attachment dialog). */
  attachmentFile?: string;
}

export interface RequestForQuotationVendorRowData {
  isGuest?: boolean;
  vendor?: AutoSuggestField;
  vendorName?: string;
  vendorLocation?: AutoSuggestField;
  vendorLocationName?: string;
  email?: string;
  contactPerson?: AutoSuggestField;
  contactPersonName?: string;
  contactEmail?: string;
}

export interface RequestForQuotationPrModalRowData {
  rowIndex?: number;
  prNo?: string;
  lineNo?: string | number;
  selected?: boolean;
  rfqQty?: string;
  rfqMake?: AutoSuggestField;
  rfqUnit?: AutoSuggestField;
}

/**
 * Flat fill payload for Request for Quotation form.
 */
export interface RequestForQuotationFillData {
  company?: AutoSuggestField;
  division?: AutoSuggestField;
  documentType?: AutoSuggestField;
  documentDate?: string;
  documentNo?: string;
  documentStatus?: string | SelectField;

  sourceDocumentType?: string | SelectField;
  sourceDocumentTypeId?: number;
  dueDate?: string;
  isPriceList?: boolean;
  contactPersonName?: AutoSuggestField | string;
  contactEmail?: string;
  remarks?: string;
  mailSubject?: string;

  tncGroup?: AutoSuggestField;
  termsNConditionRows?: Array<{
    termsNConditionHead?: AutoSuggestField;
    value?: string;
  }>;
  approvalSetup?: AutoSuggestField;

  itemRows?: RequestForQuotationItemRowData[];
  prModalRows?: RequestForQuotationPrModalRowData[];
  vendorRows?: RequestForQuotationVendorRowData[];
}
