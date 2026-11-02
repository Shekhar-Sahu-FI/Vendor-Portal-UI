import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const UNIT_MASTER_ROUTES = {
  module: 'master',
  form: 'unit-master',
  list: () => `/${portal()}/master/unit-master`,
  new: () => `/${portal()}/master/unit-master/new`,
  display: (id: number | string) => `/${portal()}/master/unit-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/unit-master/${id}/edit`,
} as const;

export const UNIT_GENERAL_LABELS = {
  code: 'Code',
  unitName: 'Unit Name',
  alias: 'Alias',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const UNIT_GRID = {
  codeColumn: 'Code',
  unitNameColumn: 'Unit Name',
  aliasColumn: 'Alias',
  codeFilterPlaceholder: 'Filter Code...',
  unitNameFilterPlaceholder: 'Filter Unit Name...',
} as const;
