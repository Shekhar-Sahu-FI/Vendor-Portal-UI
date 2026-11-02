import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const ITEM_SUBGROUP_MASTER_ROUTES = {
  module: 'master',
  form: 'item-subgroup-master',
  list: () => `/${portal()}/master/item-subgroup-master`,
  new: () => `/${portal()}/master/item-subgroup-master/new`,
  display: (id: number | string) => `/${portal()}/master/item-subgroup-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/item-subgroup-master/${id}/edit`,
} as const;

export const ITEM_SUBGROUP_GENERAL_LABELS = {
  group: 'Group',
  code: 'Code',
  subgroupName: 'Subgroup Name',
  subgroupCode: 'Subgroup Code',
  stockUnit: 'Stock Unit',
  gstCategory: 'GST Category',
  hsnSacCode: 'HSN/SAC Code',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const ITEM_SUBGROUP_GRID = {
  subgroupCodeColumn: 'Subgroup Code',
  subgroupNameColumn: 'Subgroup Name',
  groupNameColumn: 'Group',
  subgroupCodeFilterPlaceholder: 'Filter Subgroup Code...',
  subgroupNameFilterPlaceholder: 'Filter Subgroup Name...',
  groupNameFilterPlaceholder: 'Filter Group...',
} as const;
