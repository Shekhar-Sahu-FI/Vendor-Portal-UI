/** `data-cell-id` column segments — Level Detail grid */
export const ASM_LEVEL_GRID_COLUMNS = {
  levelNo: 'levelNo',
  printingCaption: 'printingCaption',
  approvalRuleId: 'approvalRuleId',
  isNextLevelSelectionAllowed: 'isNextLevelSelectionAllowed',
  userDetail: 'userDetail',
} as const;

/** `data-cell-id` column segments — Manage Users modal grid */
export const ASM_USER_MODAL_GRID_COLUMNS = {
  approverTypeId: 'approverTypeId',
  approverName: 'approverName',
  isDefault: 'isDefault',
} as const;

/** Selectable grid row checkbox column */
export const ASM_SELECT_GRID_COLUMN = 'select' as const;
