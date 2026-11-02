import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const VENDOR_MASTER_ROUTES = {
  module: 'master',
  form: 'vendor-master',
  list: () => `/${portal()}/master/vendor-master`,
  new: () => `/${portal()}/master/vendor-master/new`,
  display: (id: number | string) => `/${portal()}/master/vendor-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/vendor-master/${id}/edit`,
} as const;

export const VENDOR_MASTER_GENERAL_LABELS = {
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
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const VENDOR_MASTER_GRID = {
  locationCodeColumn: 'Location Code',
  vendorCodeColumn: 'Vendor Code',
  vendorNameColumn: 'Vendor Name',
  vendorNameFilterPlaceholder: 'Filter Vendor Name...',
  vendorCodeFilterPlaceholder: 'Filter Vendor Code...',
  locationCodeFilterPlaceholder: 'Filter Location Code...',
} as const;
