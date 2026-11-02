import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const ANNOUNCEMENT_MASTER_ROUTES = {
  module: 'master',
  form: 'announcement-master',
  list: () => `/${portal()}/master/announcement-master`,
  new: () => `/${portal()}/master/announcement-master/new`,
  display: (id: number | string) => `/${portal()}/master/announcement-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/announcement-master/${id}/edit`,
} as const;

export const ANNOUNCEMENT_GENERAL_LABELS = {
  code: 'Code',
  type: 'Type',
  displayTo: 'Display To (Audience)',
  title: 'Title',
  description: 'Description',
  startDate: 'Start Date',
  endDate: 'End Date',
  bannerSize: 'Banner Size',
  scrollSpeed: 'Scroll Speed (Seconds)',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const ANNOUNCEMENT_GRID = {
  codeColumn: 'Code',
  titleColumn: 'Title',
  codeFilterPlaceholder: 'Filter Code...',
  titleFilterPlaceholder: 'Filter Title...',
} as const;
