/** `data-cell-id` column segments - Item Detail grid (Direct mode) */
export const RFQ_ITEM_GRID_COLUMNS = {
  itemName: 'itemName',
  makeName: 'makeName',
  unitCode: 'unitCode',
  techSpecification: 'techSpecification',
  qty: 'qty',
  remarks: 'remarks',
  attachment: 'attachment',
} as const;

export const RFQ_ITEM_ATTACHMENT_DIALOG_TITLE = 'Item Attachments';

/** `data-cell-id` column segments - Vendor Detail grid */
export const RFQ_VENDOR_GRID_COLUMNS = {
  isGuest: 'isGuest',
  vendorName: 'vendorName',
  vendorLocationName: 'vendorLocationName',
  email: 'email',
  contactPersonName: 'contactPersonName',
  contactEmail: 'contactEmail',
  contactNo: 'contactNo',
} as const;

/** `data-cell-id` column segments - Select from PR modal grid */
export const RFQ_PR_MODAL_GRID_COLUMNS = {
  select: 'select',
  displayDocNoYearly: 'displayDocNoYearly',
  lineNo: 'lineNo',
  rfqMake: 'rfqMake',
  rfqUnit: 'rfqUnit',
  rfqQty: 'rfqQty',
} as const;

export const RFQ_ITEM_GRID_OVERLAY_PLACEHOLDERS = {
  techSpecification: 'Enter Description',
  remarks: 'Enter Remarks',
} as const;
