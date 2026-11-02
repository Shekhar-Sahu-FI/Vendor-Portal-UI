import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const REGION_MASTER_ROUTES = {
  module: 'master',
  form: 'region-master',
  list: () => `/${portal()}/master/region-master`,
  new: () => `/${portal()}/master/region-master/new`,
  display: (id: number | string) => `/${portal()}/master/region-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/region-master/${id}/edit`,
} as const;

export const REGION_GENERAL_LABELS = {
  code: 'Code',
  regionName: 'Region Name',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const REGION_GRID = {
  codeColumn: 'Code',
  regionNameColumn: 'Region Name',
  codeFilterPlaceholder: 'Filter Code...',
  regionNameFilterPlaceholder: 'Filter Region Name...',
} as const;
