import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const COMPANY_MASTER_ROUTES = {
  module: 'master',
  form: 'company-master',
  list: () => `/${portal()}/master/company-master`,
  new: () => `/${portal()}/master/company-master/new`,
  display: (id: number | string) => `/${portal()}/master/company-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/company-master/${id}/edit`,
} as const;

export const COMPANY_GENERAL_LABELS = {
  code: 'Code',
  companyName: 'Company Name',
  alias: 'Alias',
  printingName: 'Printing Name',
  headOffice: 'Head Office',
  address1: 'Address Line 1',
  address2: 'Address Line 2',
  address3: 'Address Line 3',
  country: 'Country',
  state: 'State',
  city: 'City',
  pincode: 'Pincode',
  email: 'Email',
  website: 'Website',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const COMPANY_GRID = {
  codeColumn: 'Code',
  companyNameColumn: 'Company Name',
  aliasColumn: 'Alias',
  codeFilterPlaceholder: 'Filter Code...',
  companyNameFilterPlaceholder: 'Filter Company Name...',
  aliasFilterPlaceholder: 'Filter Alias...',
} as const;
