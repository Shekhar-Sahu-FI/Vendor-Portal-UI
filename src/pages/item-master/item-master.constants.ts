import { env } from '../../utils/env';
import { columnFilterPlaceholder } from '../../utils/save-response.helper';

const portal = () => env.userPortal;

export const ITEM_MASTER_ROUTES = {
  module: 'master',
  form: 'item-master',
  list: () => `/${portal()}/master/item-master`,
  new: () => `/${portal()}/master/item-master/new`,
  display: (id: number | string) => `/${portal()}/master/item-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/item-master/${id}/edit`,
} as const;

export const GENERAL_DETAIL_LABELS = {
  sectionTitle: 'General Detail',
  subgroupName: ' Item Subgroup Name',
  groupName: ' Item Group Name',
  categoryName: ' Item Category Name',
  itemCode: ' Item Code',
  itemName: 'Item Name',
  code: 'Code',
  stockUnit: 'Stock Unit',
  gstCategory: ' GST Category',
  hsnSacCode: 'HSN/SAC Code',
  remarks: 'Remarks',
} as const;

export const MAKE_DETAIL_LABELS = {
  sectionTitle: 'Make Detail',
  makeMgmtType: ' Make Management Type',
} as const;

export const UNIT_CONVERSION_LABELS = {
  sectionTitle: 'Unit Conversion Detail',
  multipleUnitApplicable: 'Multiple Unit Applicable',
} as const;

export const STATUS_DETAIL_LABELS = {
  sectionTitle: 'Status Detail',
  status: ' Status',
  statusRemarks: 'Status Remarks',
} as const;

export const ITEM_MASTER_GRID = {
  itemCodeColumn: 'Item Code',
  itemNameColumn: 'Item Name',
  itemCodeFilterPlaceholder: columnFilterPlaceholder('Item Code'),
  itemNameFilterPlaceholder: columnFilterPlaceholder('Item Name'),
} as const;

export const ITEM_MASTER_API = {
  base: '/api/master/items',
  byId: (id: number | string) => `/api/master/items/${id}`,
  nextCode: (subgroupId: number | string) => `/api/master/items/next-code/${subgroupId}`,
} as const;
