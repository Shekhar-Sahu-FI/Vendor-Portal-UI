import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const PRIORITY_MASTER_ROUTES = {
  module: 'master',
  form: 'priority-master',
  list: () => `/${portal()}/master/priority-master`,
  new: () => `/${portal()}/master/priority-master/new`,
  display: (id: number | string) => `/${portal()}/master/priority-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/priority-master/${id}/edit`,
} as const;

export const PRIORITY_GENERAL_LABELS = {
  code: 'Code',
  priorityName: 'Priority Name',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const PRIORITY_GRID = {
  codeColumn: 'Code',
  priorityNameColumn: 'Priority Name',
  codeFilterPlaceholder: 'Filter Code...',
  priorityNameFilterPlaceholder: 'Filter Priority Name...',
} as const;
