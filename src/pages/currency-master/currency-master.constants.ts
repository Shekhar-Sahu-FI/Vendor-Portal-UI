import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const CURRENCY_MASTER_ROUTES = {
  module: 'master',
  form: 'currency-master',
  list: () => `/${portal()}/master/currency-master`,
  new: () => `/${portal()}/master/currency-master/new`,
  display: (id: number | string) => `/${portal()}/master/currency-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/currency-master/${id}/edit`,
} as const;

export const CURRENCY_GENERAL_LABELS = {
  code: 'Code',
  currencyName: 'Currency Name',
  currencyNotation: 'Currency Notation',
  currencySymbol: 'Currency Symbol',
  subunitName: 'Subunit Name',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const CURRENCY_GRID = {
  codeColumn: 'Code',
  currencyNameColumn: 'Currency Name',
  currencyNotationColumn: 'Currency Notation',
  codeFilterPlaceholder: 'Filter Code...',
  currencyNameFilterPlaceholder: 'Filter Currency Name...',
  currencyNotationFilterPlaceholder: 'Filter Currency Notation...',
} as const;
