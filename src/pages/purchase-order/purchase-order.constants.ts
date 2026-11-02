import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const PURCHASE_ORDER_ROUTES = {
  module: 'transaction',
  form: 'purchase-order',
  list: () => `/${portal()}/transaction/purchase-order`,
  new: () => `/${portal()}/transaction/purchase-order/new`,
  display: (id: number | string) => `/${portal()}/transaction/purchase-order/${id}`,
  edit: (id: number | string) => `/${portal()}/transaction/purchase-order/${id}/edit`,
} as const;

export const PURCHASE_ORDER_REFERENCE_DOCUMENT_TYPE = {
  purchaseRequest: 3,
  quotation: 4,
  direct: 2,
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
  expenditureType: 'Expenditure Type',
  referenceDocumentType: 'Reference Document Type',
  referenceDocumentNo: 'Reference Document No.',
  vendorName: 'Vendor Name',
  vendorLocation: 'Vendor Location',
  contactPersonName: 'Contact Person Name',
  validityDate: 'Validity Date',
  departmentName: 'Department Name',
  partyReferenceNo: 'Party Reference No.',
  partyReferenceDate: 'Party Reference Date',
  erpSerialNo: 'ERP Serial No.',
  remarks: 'Remarks',
} as const;

export const ITEM_DETAIL_LABELS = {
  sectionTitle: 'Item Detail',
  itemDescription: 'Item Description',
  make: 'Make',
  technicalSpecification: 'Technical Specification',
  qty: 'Qty',
  unit: 'Unit',
  rate: 'Rate',
  remarks: 'Remark',
} as const;

export const SHIPPING_DETAIL_LABELS = {
  sectionTitle: 'Shipping Detail',
  carrierType: 'Carrier Type',
  paymentMode: 'Payment Mode',
  dueBasis: 'Due Basis',
  dueDays: 'Due Days',
  freightType: 'Freight Type',
  freightRate: 'Freight Rate',
  freightAmount: 'Freight Amount',
  priority: 'Priority',
  fromLocation: 'From Location',
  toLocation: 'To Location',
  consigneeLocation: 'Consignee Location',
} as const;

export const CURRENCY_DETAIL_LABELS = {
  sectionTitle: 'Currency Detail',
  currency: 'Currency',
  exchangeRate: 'Exchange Rate',
} as const;

export const TERMS_CONDITION_LABELS = {
  sectionTitle: 'Terms & Conditions',
  group: 'Terms & Conditions Group',
  addRow: 'Add Row',
} as const;

export const PURCHASE_ORDER_PR_MODAL_LABELS = {
  title: 'Purchase Request',
  showPurchaseRequest: 'Show Purchase Request',
  fromDate: 'From Date',
  toDate: 'To Date',
  cancel: 'Cancel',
  ok: 'Ok',
} as const;

export const PURCHASE_ORDER_GRID = {
  docNoColumn: 'Pur. Ord. No.',
  docNoFilterPlaceholder: 'Filter Pur. Ord. No....',
} as const;
