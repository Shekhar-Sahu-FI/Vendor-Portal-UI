import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const VENDOR_CATEGORY_MASTER_ROUTES = {
  module: 'master',
  form: 'vendor-category-master',
  list: () => `/${portal()}/master/vendor-category-master`,
  new: () => `/${portal()}/master/vendor-category-master/new`,
  display: (id: number | string) => `/${portal()}/master/vendor-category-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/vendor-category-master/${id}/edit`,
} as const;

export const VENDOR_CATEGORY_GENERAL_LABELS = {
  code: 'Code',
  vendorCategoryName: 'Vendor Category Name',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const VENDOR_CATEGORY_GRID = {
  codeColumn: 'Code',
  vendorCategoryNameColumn: 'Vendor Category Name',
  codeFilterPlaceholder: 'Filter Code...',
  vendorCategoryNameFilterPlaceholder: 'Filter Vendor Category Name...',
} as const;
