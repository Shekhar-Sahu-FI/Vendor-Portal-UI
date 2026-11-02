import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const VENDOR_LOCATION_MASTER_ROUTES = {
  module: 'master',
  form: 'vendor-location-master',
  list: () => `/${portal()}/master/vendor-location-master`,
  new: () => `/${portal()}/master/vendor-location-master/new`,
  display: (id: number | string) => `/${portal()}/master/vendor-location-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/vendor-location-master/${id}/edit`,
} as const;

export const VENDOR_LOCATION_GENERAL_LABELS = {
  vendor: 'Vendor',
  locationName: 'Location Name',
  address1: 'Address Line 1',
  address2: 'Address Line 2',
  address3: 'Address Line 3',
  country: 'Country',
  state: 'State',
  city: 'City',
  pincode: 'Pincode',
  contactNo: 'Contact No.',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const VENDOR_LOCATION_GRID = {
  locationCodeColumn: 'Location Code',
  vendorCodeColumn: 'Vendor Code',
  vendorNameColumn: 'Vendor Name',
  vendorNameFilterPlaceholder: 'Filter Vendor Name...',
  locationCodeFilterPlaceholder: 'Filter Location Code...',
} as const;
