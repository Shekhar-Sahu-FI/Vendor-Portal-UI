import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const VENDOR_ATTACHMENT_MASTER_ROUTES = {
  module: 'master',
  form: 'vendor-attachment-master',
  list: () => `/${portal()}/master/vendor-attachment-master`,
  new: () => `/${portal()}/master/vendor-attachment-master/new`,
  display: (id: number | string) => `/${portal()}/master/vendor-attachment-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/vendor-attachment-master/${id}/edit`,
} as const;

export const VENDOR_ATTACHMENT_GENERAL_LABELS = {
  code: 'Code',
  documentName: 'Document Name',
  maxFileSize: 'Max File Size (in KB)',
  isMandatory: 'Is Mandatory',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const VENDOR_ATTACHMENT_GRID = {
  codeColumn: 'Code',
  documentNameColumn: 'Document Name',
  codeFilterPlaceholder: 'Filter Code...',
  documentNameFilterPlaceholder: 'Filter Document Name...',
} as const;
