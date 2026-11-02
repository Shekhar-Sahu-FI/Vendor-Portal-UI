/** Auto-suggestion field: type query, select value */
export interface AutoSuggestField {
  query: string;
  value: string;
}

export interface ApprovalSetupUserRowData {
  approverType?: 'User' | 'Role';
  approverName?: AutoSuggestField;
  isDefault?: boolean;
}

export interface ApprovalSetupLevelRowData {
  printingCaption?: string;
  approvalRule?: string;
  isNextLevelSelectable?: boolean;
  users?: ApprovalSetupUserRowData[];
}

/**
 * Flat fill payload for Approval Setup Master form.
 * Only provided fields are filled.
 */
export interface ApprovalSetupFillData {
  approvalSetupName?: string;
  formName?: AutoSuggestField;
  approvalScope?: string;
  minNetAmount?: string;
  maxNetAmount?: string;
  description?: string;
  isAudit?: boolean;
  fromDate?: string;
  toDate?: string;
  companyRows?: string[];
  docTypeRows?: string[];
  levelRows?: ApprovalSetupLevelRowData[];
  status?: string;
  statusRemarks?: string;
}
