import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const ITEM_CATEGORY_MASTER_ROUTES = {
  module: 'master',
  form: 'item-category-master',
  list: () => `/${portal()}/master/item-category-master`,
  new: () => `/${portal()}/master/item-category-master/new`,
  display: (id: number | string) => `/${portal()}/master/item-category-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/item-category-master/${id}/edit`,
} as const;

export const ITEM_CATEGORY_GENERAL_LABELS = {
  code: 'Code',
  categoryName: 'Category Name',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const ITEM_CATEGORY_GRID = {
  codeColumn: 'Code',
  categoryNameColumn: 'Category Name',
  codeFilterPlaceholder: 'Filter Code...',
  categoryNameFilterPlaceholder: 'Filter Category Name...',
} as const;
