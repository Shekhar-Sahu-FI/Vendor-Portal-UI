/** `data-cell-id` column segments - Item Detail grid */
export const PO_ITEM_GRID_COLUMNS = {
  itemName: 'itemName',
  makeName: 'makeName',
  techSpecification: 'techSpecification',
  qty: 'qty',
  schedule: 'schedule',
  unitCode: 'unitCode',
  rate: 'rate',
  costCenterName: 'costCenterName',
  remarks: 'remarks',
} as const;

/** Item Schedule modal grid columns */
export const PO_ITEM_SCHEDULE_GRID_COLUMNS = {
  scheduleDate: 'scheduleDate',
} as const;

/** `data-cell-id` column segments - Select from PR modal grid */
export const PO_PR_MODAL_GRID_COLUMNS = {
  prDocNoYearly: 'prDocNoYearly',
  itemName: 'itemName',
  poMakeName: 'poMakeName',
  poUnitCode: 'poUnitCode',
  prQty: 'prQty',
  balanceQty: 'balanceQty',
  poQty: 'poQty',
} as const;

export const PO_ITEM_GRID_OVERLAY_PLACEHOLDERS = {
  techSpecification: 'Enter Technical Specification',
  remarks: 'Enter Remark',
} as const;
