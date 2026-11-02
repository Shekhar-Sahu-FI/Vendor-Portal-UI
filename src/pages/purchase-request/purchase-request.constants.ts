import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const PURCHASE_REQUEST_ROUTES = {
  module: 'transaction',
  form: 'purchase-request',
  list: () => `/${portal()}/transaction/purchase-request`,
  new: () => `/${portal()}/transaction/purchase-request/new`,
  display: (id: number | string) => `/${portal()}/transaction/purchase-request/${id}`,
  edit: (id: number | string) => `/${portal()}/transaction/purchase-request/${id}/edit`,
} as const;

/** Document Detail card (UCDocSeriesSetting in purchase-request-form.tsx) */
export const DOCUMENT_DETAIL_LABELS = {
  sectionTitle: 'Document Detail',
  company: 'Company',
  division: 'Division',
  documentType: 'Doc. Type',
  documentDate: 'PR Date',
  documentNo: 'PR No.',
  documentStatus: 'Doc. Status',
} as const;

/** General Detail tab (components/general-details.tsx) */
export const GENERAL_DETAIL_LABELS = {
  sectionTitle: 'General Detail',
  department: 'Department',
  expenditureType: 'Expenditure Type',
  requestedBy: 'Requested By',
  requestedByEmail: 'Requested By Email',
  requestedContactNo: 'Requested Contact No.',
  referenceNo: 'Ref. No.',
  referenceDate: 'Ref. Date',
  erpSerialNo: 'ERP Serial No.',
  remarks: 'Remarks',
} as const;

/** Item Detail grid columns (components/item-details.tsx) */
export const ITEM_DETAIL_LABELS = {
  sectionTitle: 'Item Detail',
  itemName: 'Item Name',
  make: 'Make',
  techSpec: 'Tech. Specification',
  techSpecification: 'Tech. Specification',
  unit: 'Unit',
  requiredQty: 'Req. Qty.',
  prQty: 'Pur. Req. Qty.',
  rate: 'Rate',
  amount: 'Amount',
  schedule: 'Schedule',
  costCenter: 'Cost Center',
  priority: 'Priority',
  remarks: 'Remarks',
  attachments: 'Attachments',
  reason: 'Reason',
} as const;

/** Inform To grid columns (common/b-components/uc-inform-to.tsx) */
export const INFORM_TO_LABELS = {
  sectionTitle: 'Inform To',
  userName: 'User Name',
  email: 'Email',
  contactNo: 'Contact No.',
  // Aliases for compatibility
  personName: 'User Name',
  whatsApp: 'Contact No.',
} as const;

/** Authorization Group card (purchase-request-form.tsx) */
export const AUTHORIZATION_GROUP_LABELS = {
  sectionTitle: 'Authorization Group',
} as const;

/** Form field placeholders from UI components */
export const PURCHASE_REQUEST_PLACEHOLDERS = {
  // General details
  department: 'Search Department',
  expenditureType: 'Select Expenditure Type',
  requestedBy: 'Search Requested By',
  requestedByEmail: 'Enter Requested By Email',
  requestedContactNo: 'Enter Requested Contact No.',
  referenceNo: 'Enter Ref. No.',
  referenceDate: 'Select Ref. Date',
  erpSerialNo: 'Select ERP Serial No.',
  remarks: 'Enter Remarks',

  // Item details
  itemName: 'Search Item Name',
  make: 'Search Make',
  techSpecification: 'Enter Tech. Specification',
  unit: 'Search Unit',
  requiredQty: 'Enter Req. Qty.',
  prQty: 'Enter Pur. Req. Qty.',
  rate: 'Enter Rate',
  schedule: 'Select Schedule',
  costCenter: 'Search Cost Center',
  priority: 'Search Priority',
  itemRemarks: 'Enter Remarks',
  reason: 'Search Reason',

  // Inform To
  userName: 'Enter User Name',
} as const;

/** @deprecated Use DOCUMENT_DETAIL_LABELS / GENERAL_DETAIL_LABELS */
export const PURCHASE_REQUEST_FIELD_LABELS = {
  ...GENERAL_DETAIL_LABELS,
  itemName: ITEM_DETAIL_LABELS.itemName,
  requiredQty: ITEM_DETAIL_LABELS.requiredQty,
  prQty: ITEM_DETAIL_LABELS.prQty,
} as const;

/** Search DataGrid columns & filters (purchase-request-config.ts) */
export const PURCHASE_REQUEST_GRID = {
  docNoColumn: 'PR No.',
  docNoFilterPlaceholder: 'PR No.',
  docDateColumn: 'PR Date',
  companyColumn: 'Company',
  divisionColumn: 'Division',
  docTypeColumn: 'Doc. Type',
  departmentColumn: 'Department',
  expenditureTypeColumn: 'Expenditure Type',
  itemsColumn: 'Items',
  createdByColumn: 'Created By',
  createdDateColumn: 'Created Date',
  authorizedByColumn: 'Authorized By',
  authorizedDateColumn: 'Authorized Date',
  authLevelColumn: 'Auth Level',
  currentAuthLevelColumn: 'Current Auth Level',
  docStatusColumn: 'Doc. Status',
  statusColumn: 'Status',
} as const;

/** Display view labels (purchase-request-display-config.ts) */
export const PURCHASE_REQUEST_DISPLAY_LABELS = {
  company: 'Company',
  division: 'Division',
  docType: 'Doc. Type',
  prNo: 'PR No.',
  docStatus: 'Doc. Status',
  prDate: 'PR Date',
  department: 'Department',
  expenditureType: 'Expenditure Type',
  refNo: 'Ref. No.',
  refDate: 'Ref. Date',
  erpSerialNo: 'ERP Serial No.',
  requestedBy: 'Requested By',
  requestedContactNo: 'Requested Contact No.',
  requestedByEmail: 'Requested By Email',
  netAmount: 'Net Amount',
  erpDocNo: 'ERP Doc No.',
} as const;

export const PURCHASE_REQUEST_API = {
  base: '/api/purchase-requests',
  delete: (id: number | string) => `/api/purchase-requests/${id}`,
} as const;

