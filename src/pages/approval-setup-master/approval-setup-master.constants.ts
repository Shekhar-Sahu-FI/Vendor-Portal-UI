import { env } from '../../utils/env';
import { columnFilterPlaceholder } from '../../utils/save-response.helper';

const portal = () => env.userPortal;

export const APPROVAL_SETUP_MASTER_ROUTES = {
  module: 'master',
  form: 'approval-setup-master',
  list: () => `/${portal()}/master/approval-setup-master`,
  new: () => `/${portal()}/master/approval-setup-master/new`,
  display: (id: number | string) => `/${portal()}/master/approval-setup-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/approval-setup-master/${id}/edit`,
} as const;

export const GENERAL_DETAIL_LABELS = {
  sectionTitle: 'General Detail',
  code: 'Code',
  approvalSetupName: 'Approval Setup Name',
  formName: 'Form Name',
  approvalScope: 'Approval Scope',
  minNetAmount: 'Min Net Amount',
  maxNetAmount: 'Max Net Amount',
  description: 'Description',
  isAudit: 'Is Audit',
  fromDate: 'From Date',
  toDate: 'To Date',
  applyToExistingDocuments: 'Apply to Existing Documents',
} as const;

export const COMPANY_DETAIL_LABELS = {
  sectionTitle: 'Company Detail',
  company: 'Company',
  division: 'Division',
  department: 'Department',
} as const;

export const DOC_TYPE_DETAIL_LABELS = {
  sectionTitle: 'Doc. Type Detail',
  code: 'Code',
  docType: 'Doc. Type',
} as const;

export const LEVEL_DETAIL_LABELS = {
  sectionTitle: 'Level Detail',
  levelNo: 'Level No.',
  printingCaption: 'Printing Caption',
  approvalRule: 'Approval Rule',
  nextLevelSelectable: 'Next Level Selectable',
  usersRoles: 'Users/Roles',
} as const;

export const STATUS_DETAIL_LABELS = {
  sectionTitle: 'Status Detail',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const USER_MODAL_LABELS = {
  approverType: 'Approver Type',
  approverName: 'Approver Name',
  isDefault: 'Is Default',
  doneButton: 'Done',
} as const;

export const APPROVAL_SETUP_MASTER_GRID = {
  codeColumn: 'Code',
  nameColumn: 'Approval Setup Name',
  codeFilterPlaceholder: columnFilterPlaceholder('Code'),
  nameFilterPlaceholder: columnFilterPlaceholder('Approval Setup Name'),
} as const;

export const APPROVAL_SETUP_MASTER_API = {
  base: '/api/master/approval-setups',
  byId: (id: number | string) => `/api/master/approval-setups/${id}`,
} as const;
