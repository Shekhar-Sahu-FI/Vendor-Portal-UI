import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const LOCATION_MASTER_ROUTES = {
  module: 'master',
  form: 'location-master',
  list: () => `/${portal()}/master/location-master`,
  new: () => `/${portal()}/master/location-master/new`,
  display: (id: number | string) => `/${portal()}/master/location-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/location-master/${id}/edit`,
} as const;

export const LOCATION_GENERAL_LABELS = {
  code: 'Code',
  locationName: 'Location Name',
  alias: 'Alias',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const LOCATION_GRID = {
  codeColumn: 'Code',
  locationNameColumn: 'Location Name',
  aliasColumn: 'Alias',
  codeFilterPlaceholder: 'Filter Code...',
  locationNameFilterPlaceholder: 'Filter Location Name...',
  aliasFilterPlaceholder: 'Filter Alias...',
} as const;
