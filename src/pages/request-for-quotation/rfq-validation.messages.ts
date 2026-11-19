/**
 * Validation messages from use-request-for-quotation.ts (validation engine schema).
 */
export const RFQ_VALIDATION_MESSAGES = {
  // Header / Document Detail
  docTypeRequired: 'Select Doc. Type.',
  documentTypeRequired: 'Select Doc. Type.',
  docNoRequired: 'Enter RFQ No.',
  rfqDateRequired: 'Select valid RFQ Date.',
  documentDateRequired: 'Select valid RFQ Date.',
  documentDateFuture: 'Document Date cannot be a future date.',
  dueDateRequired: 'Select Due Date.',
  dueDateBeforeDocDate: 'Due Date must be on or after RFQ Date.',
  dueDateBeforeRfqDate: 'Due Date must be on or after RFQ Date.',
  mailSubjectMaxLength: 'Mail Subject must be less than 500 characters.',
  contactEmailInvalid: 'Invalid Contact Person Email format.',
  invalidContactNumber: 'Invalid Contact number.',
  remarksMaxLength: 'Remarks must be less than 500 characters.',
  rollbackMessage: 'Rollbacked document cannot be modified / saved',

  // Items Grid (Direct Mode)
  atLeastOneItem: 'At least one Item is required.',
  itemRequired: (row: number) => `Select Item Name for row no. ${row}.`,
  makeRequired: (row: number) => `Select Make for row no. ${row}.`,
  techSpecRequired: (row: number) => `Enter Tech. Specification for row no. ${row}.`,
  hsnCodeRequired: (row: number) => `Enter HSN Code for row no. ${row}.`,
  hsnCodeFormat: 'HSN Code must be a number of length 2, 4, 6, or 8.',
  unitRequired: (row: number) => `Select Unit for row no. ${row}.`,
  qtyGreaterThanZero: (row: number) => `Qty. must be greater than 0 for row no. ${row}.`,
  duplicateItemMake: 'Duplicate Item and Make combination is not allowed.',

  // PR Mode / Sourcing Modal
  prSelectAtLeastOne: 'Select at least one item.',
  rfqUnitMandatory: 'RFQ Unit is mandatory.',
  unitConsistency: 'Unit must be the same for the same item and make.',
  selectRfqMake: 'Select RFQ Make.',
  rfqQtyGreaterThanZero: 'RFQ Qty. must be greater than 0.',
  rfqQtyExceedsBalance: 'RFQ Qty. must not exceed the balance qty.',
  unitRequiredModal: 'Unit is required.',

  // Vendors Grid
  atLeastOneVendor: 'At least one Vendor is required.',
  vendorRequired: (row: number) => `Select Vendor for row no. ${row}.`,
  vendorLocationRequired: (row: number) => `Select Vendor Location for row no. ${row}.`,
  duplicateVendorLocation: 'Duplicate Vendor Location is not allowed.',
  guestVendorNameRequired: (row: number) => `Enter Guest Vendor Name for row no. ${row}.`,
  guestEmailRequired: (row: number) => `Enter Guest Email for row no. ${row}.`,
  guestEmailInvalid: (row: number) => `Invalid Guest Email format for row no. ${row}.`,
  guestContactNoRequired: (row: number) => `Enter Contact No. for row no. ${row}.`,
  duplicateGuestEmail: 'Duplicate guest vendor email is not allowed.',
  duplicateContactPerson: (row: number) => `Duplicate contact person not allowed in row no. ${row}.`,
  suggestVendorsSelectItemsFirst: 'Please select item(s) first.',

  // Contact Persons Modal
  contactPersonNameRequired: 'Enter Contact Name.',
  contactPersonEmailInvalid: 'Invalid contact email format.',
  duplicateContactPersonModal: 'Duplicate contact person is not allowed.',

  // Terms & Conditions
  tncHeadRequired: (row: number) => `Select T&C Head Name for row no. ${row}.`,

  // Due Date Amendment Modal
  newDueDateRequired: 'New Due Date is required.',
  newDueDateFuture: 'New Due Date must be after the current date and time.',
  newDueDateOnOrAfterRfqDate: 'New Due Date must be on or after RFQ Date.',
  newDueDateDifferent: 'New Due Date must be different from the current Due Date.',
  amendmentReasonMaxLength: 'Reason cannot exceed 500 characters.',

  // Vendor Add Modal
  vendorLocationAlreadyAdded: 'Vendor location is already added in this RFQ.',
  guestEmailAlreadyAdded: 'Guest vendor email is already added in this RFQ.',

  // RFQ Item Removal Modal
  selectPrItemToRemove: 'Select at least one PR item to remove.',
  removalReasonRequired: 'Reason is required.',
  removalReasonMaxLength: 'Reason must be less than 500 characters.',

  // Workflow & Deletion
  selectApprovalSetup: 'Select Approval Setup.',
  workflowMandatory: 'Authorization Group is required as Approval Process is Mandatory.',
  relatedTransactionsExist: 'This record cannot be deleted because related transactions exist.',
} as const;
