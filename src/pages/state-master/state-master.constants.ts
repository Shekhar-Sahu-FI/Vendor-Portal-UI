import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const STATE_MASTER_ROUTES = {
  module: 'master',
  form: 'state-master',
  list: () => `/${portal()}/master/state-master`,
  new: () => `/${portal()}/master/state-master/new`,
  display: (id: number | string) => `/${portal()}/master/state-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/state-master/${id}/edit`,
} as const;

export const STATE_GENERAL_LABELS = {
  code: 'Code',
  stateName: 'State Name',
  country: 'Country',
  gstStateCode: 'GST State Code',
  isUnionTerritory: 'Is Union Territory',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const STATE_GRID = {
  codeColumn: 'Code',
  stateNameColumn: 'State Name',
  countryNameColumn: 'Country',
  codeFilterPlaceholder: 'Filter Code...',
  stateNameFilterPlaceholder: 'Filter State Name...',
  countryNameFilterPlaceholder: 'Filter Country...',
} as const;
