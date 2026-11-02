import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const CS_REASON_MASTER_ROUTES = {
  module: 'master',
  form: 'cs-reason-master',
  list: () => `/${portal()}/master/cs-reason-master`,
  new: () => `/${portal()}/master/cs-reason-master/new`,
  display: (id: number | string) => `/${portal()}/master/cs-reason-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/cs-reason-master/${id}/edit`,
} as const;

export const CS_REASON_GENERAL_LABELS = {
  code: 'Code',
  reasonName: 'CS Reason Name',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const CS_REASON_GRID = {
  codeColumn: 'Code',
  reasonNameColumn: 'CS Reason Name',
  codeFilterPlaceholder: 'Filter Code...',
  reasonNameFilterPlaceholder: 'Filter CS Reason Name...',
} as const;
