import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const BUSINESS_TYPE_MASTER_ROUTES = {
  module: 'master',
  form: 'business-type-master',
  list: () => `/${portal()}/master/business-type-master`,
  new: () => `/${portal()}/master/business-type-master/new`,
  display: (id: number | string) => `/${portal()}/master/business-type-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/business-type-master/${id}/edit`,
} as const;

export const BUSINESS_TYPE_GENERAL_LABELS = {
  code: 'Code',
  businessTypeName: 'Business Type Name',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const BUSINESS_TYPE_GRID = {
  codeColumn: 'Code',
  businessTypeNameColumn: 'Business Type Name',
  codeFilterPlaceholder: 'Filter Code...',
  businessTypeNameFilterPlaceholder: 'Filter Business Type Name...',
} as const;
