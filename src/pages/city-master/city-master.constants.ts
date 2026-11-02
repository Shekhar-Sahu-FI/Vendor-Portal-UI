import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const CITY_MASTER_ROUTES = {
  module: 'master',
  form: 'city-master',
  list: () => `/${portal()}/master/city-master`,
  new: () => `/${portal()}/master/city-master/new`,
  display: (id: number | string) => `/${portal()}/master/city-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/city-master/${id}/edit`,
} as const;

export const CITY_GENERAL_LABELS = {
  code: 'Code',
  cityName: 'City Name',
  country: 'Country',
  state: 'State',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const CITY_GRID = {
  codeColumn: 'Code',
  cityNameColumn: 'City Name',
  stateNameColumn: 'State',
  countryNameColumn: 'Country',
  codeFilterPlaceholder: 'Filter Code...',
  cityNameFilterPlaceholder: 'Filter City Name...',
  stateNameFilterPlaceholder: 'Filter State...',
  countryNameFilterPlaceholder: 'Filter Country...',
} as const;
