import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const FINANCIAL_YEAR_MASTER_ROUTES = {
  module: 'master',
  form: 'financial-year-master',
  list: () => `/${portal()}/master/financial-year-master`,
  new: () => `/${portal()}/master/financial-year-master/new`,
  display: (id: number | string) => `/${portal()}/master/financial-year-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/financial-year-master/${id}/edit`,
} as const;

export const FINANCIAL_YEAR_GENERAL_LABELS = {
  code: 'Code',
  finYearName: 'Financial Year Name',
  alias: 'Alias',
  shortAlias: 'Short Alias',
  startDate: 'Start Date',
  endDate: 'End Date',
  previousFinYear: 'Previous Financial Year',
  nextFinYear: 'Next Financial Year',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const FINANCIAL_YEAR_GRID = {
  codeColumn: 'Code',
  finYearNameColumn: 'Financial Year Name',
  codeFilterPlaceholder: 'Filter Code...',
  finYearNameFilterPlaceholder: 'Filter Financial Year Name...',
} as const;
