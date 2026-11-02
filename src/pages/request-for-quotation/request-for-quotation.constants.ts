import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const REQUEST_FOR_QUOTATION_ROUTES = {
  module: 'transaction',
  form: 'request-for-quotation',
  list: () => `/${portal()}/transaction/request-for-quotation`,
  new: () => `/${portal()}/transaction/request-for-quotation/new`,
  display: (id: number | string) => `/${portal()}/transaction/request-for-quotation/${id}`,
  edit: (id: number | string) => `/${portal()}/transaction/request-for-quotation/${id}/edit`,
} as const;

/** Matches RFQRefDocType in e-procurement enums */
export const RFQ_SOURCE_DOCUMENT_TYPE = {
  direct: 5,
  purchaseRequest: 6,
} as const;

export const DOCUMENT_DETAIL_LABELS = {
  sectionTitle: 'Document Detail',
  company: 'Company',
  division: 'Division',
  documentType: 'Document Type',
  documentDate: 'Document Date',
  documentNo: 'Document No.',
  documentStatus: 'Document Status',
} as const;

export const GENERAL_DETAIL_LABELS = {
  sectionTitle: 'General Detail',
  sourceDocument: 'Source Document',
  dueDate: 'Due Date',
  isPriceList: 'Is Price List',
  contactPersonName: 'Contact Person Name',
  contactEmail: 'Contact Person Email',
  contactNo: 'Contact No.',
  remarks: 'Remarks',
} as const;

export const ITEM_DETAIL_LABELS = {
  sectionTitle: 'Item Detail',
  selectFromPr: 'Select from PR',
} as const;

export const VENDOR_DETAIL_LABELS = {
  sectionTitle: 'Vendor Detail',
} as const;

export const TERMS_CONDITION_LABELS = {
  sectionTitle: 'Terms & Condition Detail',
  group: 'Terms & Conditions Group',
  addRow: 'Add Row',
} as const;

export const MAIL_SUBJECT_LABELS = {
  sectionTitle: 'Mail Subject',
  mailSubject: 'Mail Subject',
} as const;

export const RFQ_PR_MODAL_LABELS = {
  title: 'Purchase Request',
  cancel: 'Cancel',
  ok: 'Ok',
} as const;

export const REQUEST_FOR_QUOTATION_GRID = {
  docNoColumn: 'RFQ No.',
  docNoFilterPlaceholder: 'Filter RFQ No....',
} as const;
