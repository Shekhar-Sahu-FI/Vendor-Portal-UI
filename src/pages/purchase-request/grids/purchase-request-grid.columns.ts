/** `data-cell-id` column segments — Item Detail grid */
export const PR_ITEM_GRID_COLUMNS = {
  itemName: 'itemName',
  unitCode: 'unitCode',
  makeName: 'makeName',
  techSpecification: 'techSpecification',
  requiredQty: 'requiredQty',
  prQty: 'prQty',
  rate: 'rate',
  scheduleDate: 'scheduleDate',
  costCenterName: 'costCenterName',
  priorityId: 'priorityId',
  remarks: 'remarks',
} as const;

export type PurchaseRequestItemGridColumn = keyof typeof PR_ITEM_GRID_COLUMNS;

/** `data-cell-id` column segments — Inform To grid */
export const PR_INFORM_GRID_COLUMNS = {
  userName: 'userName',
  email: 'email',
  whatsAppNo: 'whatsAppNo',
} as const;

export type PurchaseRequestInformGridColumn = keyof typeof PR_INFORM_GRID_COLUMNS;

/** Textarea overlay placeholders from grid column editors */
export const PR_ITEM_GRID_OVERLAY_PLACEHOLDERS = {
  techSpecification: 'Enter Technical Specification',
  remarks: 'Enter Remark',
} as const;
