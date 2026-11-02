import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const COUNTRY_MASTER_ROUTES = {
  module: 'master',
  form: 'country-master',
  list: () => `/${portal()}/master/country-master`,
  new: () => `/${portal()}/master/country-master/new`,
  display: (id: number | string) => `/${portal()}/master/country-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/country-master/${id}/edit`,
} as const;

export const COUNTRY_GENERAL_LABELS = {
  code: 'Code',
  countryName: 'Country Name',
  isoCountryCode: 'ISO Country Code',
  phoneCode: 'Phone Code',
  pinCodeLength: 'Pin Code Length',
  pinCodeFormatId: 'Pin Code Format',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const COUNTRY_GRID = {
  codeColumn: 'Code',
  countryNameColumn: 'Country Name',
  isoCountryCodeColumn: 'ISO Code',
  codeFilterPlaceholder: 'Filter Code...',
  countryNameFilterPlaceholder: 'Filter Country Name...',
  isoCountryCodeFilterPlaceholder: 'Filter ISO Code...',
} as const;
