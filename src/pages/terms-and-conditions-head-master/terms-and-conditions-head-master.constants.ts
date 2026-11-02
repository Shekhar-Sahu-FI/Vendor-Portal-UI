import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const TERMS_AND_CONDITIONS_HEAD_MASTER_ROUTES = {
  module: 'master',
  form: 'terms-and-conditions-head-master',
  list: () => `/${portal()}/master/terms-and-conditions-head-master`,
  new: () => `/${portal()}/master/terms-and-conditions-head-master/new`,
  display: (id: number | string) => `/${portal()}/master/terms-and-conditions-head-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/terms-and-conditions-head-master/${id}/edit`,
} as const;

export const TERMS_AND_CONDITIONS_HEAD_GENERAL_LABELS = {
  code: 'Code',
  tncHeadName: 'T&C Head Name',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const TERMS_AND_CONDITIONS_HEAD_GRID = {
  codeColumn: 'Code',
  tncHeadNameColumn: 'T&C Head Name',
  codeFilterPlaceholder: 'Filter Code...',
  tncHeadNameFilterPlaceholder: 'Filter T&C Head Name...',
} as const;
