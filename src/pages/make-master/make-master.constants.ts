import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const MAKE_MASTER_ROUTES = {
  module: 'master',
  form: 'make-master',
  list: () => `/${portal()}/master/make-master`,
  new: () => `/${portal()}/master/make-master/new`,
  display: (id: number | string) => `/${portal()}/master/make-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/make-master/${id}/edit`,
} as const;

export const MAKE_GENERAL_LABELS = {
  code: 'Code',
  makeName: 'Make Name',
  alias: 'Alias',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const MAKE_GRID = {
  codeColumn: 'Code',
  makeNameColumn: 'Make Name',
  aliasColumn: 'Alias',
  codeFilterPlaceholder: 'Filter Code...',
  makeNameFilterPlaceholder: 'Filter Make Name...',
} as const;
