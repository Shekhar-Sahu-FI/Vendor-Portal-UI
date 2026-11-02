import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const COST_CENTER_MASTER_ROUTES = {
  module: 'master',
  form: 'cost-center-master',
  list: () => `/${portal()}/master/cost-center-master`,
  new: () => `/${portal()}/master/cost-center-master/new`,
  display: (id: number | string) => `/${portal()}/master/cost-center-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/cost-center-master/${id}/edit`,
} as const;

export const COST_CENTER_GENERAL_LABELS = {
  code: 'Code',
  alias: 'Alias',
  costCenterName: 'Cost Center Name',
  parentCostCenter: 'Parent Cost Center',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const COST_CENTER_GRID = {
  codeColumn: 'Code',
  aliasColumn: 'Alias',
  costCenterNameColumn: 'Cost Center Name',
  codeFilterPlaceholder: 'Filter Code...',
  aliasFilterPlaceholder: 'Filter Alias...',
  costCenterNameFilterPlaceholder: 'Filter Cost Center Name...',
} as const;
