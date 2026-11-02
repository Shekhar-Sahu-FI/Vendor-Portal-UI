import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const DOC_TYPE_MASTER_ROUTES = {
  module: 'master',
  form: 'doc-type-master',
  list: () => `/${portal()}/master/doc-type-master`,
  new: () => `/${portal()}/master/doc-type-master/new`,
  display: (id: number | string) => `/${portal()}/master/doc-type-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/doc-type-master/${id}/edit`,
} as const;

export const DOC_TYPE_GENERAL_LABELS = {
  code: 'Code',
  docTypeName: 'Doc. Type Name',
  docTypeAlias: 'Doc. Type Alias',
  form: 'Form',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const DOC_TYPE_GRID = {
  codeColumn: 'Code',
  docTypeNameColumn: 'Doc. Type Name',
  docTypeAliasColumn: 'Doc. Type Alias',
  codeFilterPlaceholder: 'Filter Code...',
  docTypeNameFilterPlaceholder: 'Filter Doc. Type Name...',
  docTypeAliasFilterPlaceholder: 'Filter Doc. Type Alias...',
} as const;
