import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const VENDOR_REGISTRATION_ROUTES = {
  module: 'master',
  form: 'vendor-registration',
  list: () => `/${portal()}/master/vendor-master`,
  new: () => `/${portal()}/master/vendor-registration`,
  display: (id: number | string) => `/${portal()}/master/vendor-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/vendor-master/${id}/edit`,
} as const;

export const VENDOR_REGISTRATION_GENERAL_LABELS = {
  vendorName: 'Vendor Name',
  legalName: 'Legal Name',
  address1: 'Address Line 1',
  address2: 'Address Line 2',
  address3: 'Address Line 3',
  country: 'Country',
  state: 'State',
  city: 'City',
  pincode: 'Pincode',
  email: 'Email',
  website: 'Website',
  panNo: 'PAN No.',
  contactPersonName: 'Contact Person Name',
  contactNo: 'Contact No.',
  bankName: 'Bank Name',
  branchName: 'Branch Name',
  accountNo: 'Account Number',
  ifscCode: 'IFSC Code',
} as const;

export const VENDOR_REGISTRATION_GRID = {
  vendorNameColumn: 'Vendor Name',
  legalNameColumn: 'Legal Name',
  vendorNameFilterPlaceholder: 'Filter Vendor Name...',
  legalNameFilterPlaceholder: 'Filter Legal Name...',
} as const;
