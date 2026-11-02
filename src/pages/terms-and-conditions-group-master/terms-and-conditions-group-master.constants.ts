import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const TERMS_AND_CONDITIONS_GROUP_MASTER_ROUTES = {
  module: 'master',
  form: 'terms-and-conditions-group-master',
  list: () => `/${portal()}/master/terms-and-conditions-group-master`,
  new: () => `/${portal()}/master/terms-and-conditions-group-master/new`,
  display: (id: number | string) => `/${portal()}/master/terms-and-conditions-group-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/terms-and-conditions-group-master/${id}/edit`,
} as const;

export const TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS = {
  code: 'Code',
  tncGroupName: 'T&C Group Name',
  isRfqDefault: 'RFQ Default',
  isPoDefault: 'PO Default',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const TERMS_AND_CONDITIONS_GROUP_GRID = {
  codeColumn: 'Code',
  tncGroupNameColumn: 'T&C Group Name',
  codeFilterPlaceholder: 'Filter Code...',
  tncGroupNameFilterPlaceholder: 'Filter T&C Group Name...',
} as const;
