import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const COMPANY_LOCATION_MASTER_ROUTES = {
  module: 'master',
  form: 'company-location-master',
  list: () => `/${portal()}/master/company-location-master`,
  new: () => `/${portal()}/master/company-location-master/new`,
  display: (id: number | string) => `/${portal()}/master/company-location-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/company-location-master/${id}/edit`,
} as const;

export const COMPANY_LOCATION_GENERAL_LABELS = {
  code: 'Code',
  company: 'Company',
  address1: 'Address Line 1',
  address2: 'Address Line 2',
  address3: 'Address Line 3',
  country: 'Country',
  state: 'State',
  city: 'City',
  pincode: 'Pincode',
  contactNo: 'Contact No.',
  isDefault: 'Default',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const COMPANY_LOCATION_GRID = {
  codeColumn: 'Code',
  companyColumn: 'Company',
  address1Column: 'Address Line 1',
  codeFilterPlaceholder: 'Filter Code...',
  companyFilterPlaceholder: 'Filter Company...',
  address1FilterPlaceholder: 'Filter Address Line 1...',
} as const;
