/**
 * Validation messages from use-request-for-quotation.ts (validation engine schema).
 */
export const RFQ_VALIDATION_MESSAGES = {
  documentTypeRequired: 'Document Type is required.',
  documentDateRequired: 'Select valid Document Date.',
  documentDateFuture: 'Document Date cannot be a future date.',
  dueDateRequired: 'Due Date is required.',
  dueDateBeforeDocDate: 'Due Date must be on or after RFQ Date.',
  mailSubjectMaxLength: 'Mail Subject must be less than 500 characters.',
  contactEmailInvalid: 'Invalid Contact Person Email format.',
  remarksMaxLength: 'Remarks must be less than 500 characters.',
  atLeastOneItem: 'At least one Item is required.',
  atLeastOneVendor: 'At least one Vendor is required.',
  itemRequired: (row: number) => `Item is required for row no. ${row}`,
  makeRequired: (row: number) => `Make is required for row no. ${row}`,
  techSpecRequired: (row: number) => `Tech Specification is required for row no. ${row}`,
  unitRequired: (row: number) => `Unit is required for row no. ${row}`,
  qtyGreaterThanZero: (row: number) => `Quantity must be greater than 0 for row no. ${row}`,
  vendorRequired: (row: number) => `Vendor is required for row no. ${row}`,
  vendorLocationRequired: (row: number) => `Vendor Location is required for row no. ${row}`,
  guestVendorNameRequired: (row: number) => `Guest Vendor Name is required for row no. ${row}`,
  guestEmailRequired: (row: number) => `Guest Email is required for row no. ${row}`,
  guestEmailInvalid: (row: number) => `Invalid Guest Email format for row no. ${row}`,
  duplicateItemMake: 'Duplicate Item and Make combination is not allowed.',
  duplicateVendorLocation: 'Duplicate Vendor Location is not allowed.',
  prSelectAtLeastOne: 'Select at least one item.',
} as const;
