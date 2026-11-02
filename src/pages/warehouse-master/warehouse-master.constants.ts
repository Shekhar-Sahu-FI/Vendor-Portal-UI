import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const WAREHOUSE_MASTER_ROUTES = {
  module: 'master',
  form: 'warehouse-master',
  list: () => `/${portal()}/master/warehouse-master`,
  new: () => `/${portal()}/master/warehouse-master/new`,
  display: (id: number | string) => `/${portal()}/master/warehouse-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/warehouse-master/${id}/edit`,
} as const;

export const WAREHOUSE_GENERAL_DETAIL_LABELS = {
  code: 'Code',
  warehouseName: 'Warehouse Name',
  location: 'Location',
  type: 'Warehouse Type',
  ownership: 'Ownership',
  party: 'Party (Vendor)',
} as const;

export const WAREHOUSE_ADDRESS_DETAIL_LABELS = {
  address1: 'Address Line 1',
  address2: 'Address Line 2',
  address3: 'Address Line 3',
  pincode: 'Pincode',
  country: 'Country',
  state: 'State',
  city: 'City',
} as const;

export const WAREHOUSE_STATUS_DETAIL_LABELS = {
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const WAREHOUSE_GRID = {
  codeColumn: 'Code',
  warehouseNameColumn: 'Warehouse Name',
  codeFilterPlaceholder: 'Filter Code...',
  warehouseNameFilterPlaceholder: 'Filter Warehouse Name...',
} as const;
