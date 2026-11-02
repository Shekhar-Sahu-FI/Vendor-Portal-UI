import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const INFORM_TO_GROUP_MASTER_ROUTES = {
  module: 'master',
  form: 'inform-to-group-master',
  list: () => `/${portal()}/master/inform-to-group-master`,
  new: () => `/${portal()}/master/inform-to-group-master/new`,
  display: (id: number | string) => `/${portal()}/master/inform-to-group-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/inform-to-group-master/${id}/edit`,
} as const;

export const INFORM_TO_GROUP_GENERAL_LABELS = {
  code: 'Code',
  informToGroupName: 'Inform To Group Name',
  description: 'Description',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const INFORM_TO_GROUP_GRID = {
  codeColumn: 'Code',
  groupNameColumn: 'Inform To Group Name',
  codeFilterPlaceholder: 'Filter Code...',
  groupNameFilterPlaceholder: 'Filter Inform To Group Name...',
} as const;
