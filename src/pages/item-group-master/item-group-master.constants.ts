import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const ITEM_GROUP_MASTER_ROUTES = {
  module: 'master',
  form: 'item-group-master',
  list: () => `/${portal()}/master/item-group-master`,
  new: () => `/${portal()}/master/item-group-master/new`,
  display: (id: number | string) => `/${portal()}/master/item-group-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/item-group-master/${id}/edit`,
} as const;

export const ITEM_GROUP_GENERAL_LABELS = {
  category: 'Category',
  code: 'Code',
  groupName: 'Group Name',
  groupCode: 'Group Code',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const ITEM_GROUP_GRID = {
  codeColumn: 'Code',
  groupNameColumn: 'Group Name',
  groupCodeColumn: 'Group Code',
  codeFilterPlaceholder: 'Filter Code...',
  groupNameFilterPlaceholder: 'Filter Group Name...',
  groupCodeFilterPlaceholder: 'Filter Group Code...',
} as const;
