import { env } from '../../utils/env';

const portal = () => env.userPortal;

export const DEPARTMENT_MASTER_ROUTES = {
  module: 'master',
  form: 'department-master',
  list: () => `/${portal()}/master/department-master`,
  new: () => `/${portal()}/master/department-master/new`,
  display: (id: number | string) => `/${portal()}/master/department-master/${id}`,
  edit: (id: number | string) => `/${portal()}/master/department-master/${id}/edit`,
} as const;

export const DEPARTMENT_GENERAL_LABELS = {
  code: 'Code',
  departmentName: 'Department Name',
  status: 'Status',
  statusRemarks: 'Status Remarks',
} as const;

export const DEPARTMENT_GRID = {
  codeColumn: 'Code',
  departmentNameColumn: 'Department Name',
  codeFilterPlaceholder: 'Filter Code...',
  departmentNameFilterPlaceholder: 'Filter Department Name...',
} as const;
