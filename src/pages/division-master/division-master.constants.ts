import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const DIVISION_MASTER_ROUTES = {
  module: 'master',
  form: 'division-master',
  list: () => `/${portal()}/master/division-master`,
  new: () => `/${portal()}/master/division-master/new`,
  display: (id: number | string) => `/${portal()}/master/division-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/division-master/${id}/edit`,
} as const;

export const DIVISION_GENERAL_LABELS = {
  code: 'Code',
  divisionName: 'Division Name',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const DIVISION_GRID = {
  codeColumn: 'Code',
  divisionNameColumn: 'Division Name',
  codeFilterPlaceholder: 'Filter Code...',
  divisionNameFilterPlaceholder: 'Filter Division Name...',
} as const;
