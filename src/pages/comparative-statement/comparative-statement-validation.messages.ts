/**
 * Validation and workflow alert messages for Comparative Statement (CS).
 * Matches e-procurement-user-interface/src/pages/purchase/cs/use-cs.ts and related components.
 */
export const COMPARATIVE_STATEMENT_VALIDATION_MESSAGES = {
  // Document Series & Header
  selectValidDocType: 'Select valid Doc. Type.',
  selectValidCsDate: 'Select valid CS Date.',
  csDateLessThanRefDocDate: 'CS Date cannot be less than Ref. Doc. Date.',
  enterCsNo: 'Enter CS No.',
  rollbackedDocStatus: 'Document is rollbacked, you cannot perform any action.',

  // General Details & Reference Documents
  selectValidRfq: 'Select valid RFQ.',
  selectValidRefCs: 'Select valid Ref. CS.',
  selectValidValidityDate: 'Select valid Validity Date.',
  validityDateLessThanCsDate: 'Validity Date cannot be less than CS Date.',
  duplicateCsForRfqWarning: 'A CS is already created for this RFQ. Do you want to continue?',

  // Vendor Selection - Quotation-Wise
  atLeastOneQuotationReceived: 'At least one quotation must be Recieved.',
  atLeastOneQuotationSelected: 'At least one quotation must be selected.',
  reasonRequiredNonL1Quotation: 'Reason is required for selecting a non-L1 Quotation.',
  makeMappingRequiredQuotation: 'Make mapping is required for selected quotation.',
  makeMappingRequiredRow: (rows: string | number) => `Make mapping is required for Row No. ${rows}.`,

  // Vendor Selection - Item-Wise
  atLeastOneQuotationItemSelected: 'At least one quotation item must be selected.',
  makeMappingRequiredItem: 'Make mapping is required for selected items.',
  selectedQtyGreaterThanItemQty: (selectedQty: number, itemQty: number) =>
    `Selected total qty (${selectedQty}) cannot be greater than item qty (${itemQty}).`,

  // Validity Date Amendment Modal
  newValidityDateRequired: 'New Validity Date is required.',
  newValidityDateOnOrAfterCsDate: 'New Validity Date must be on or after CS Date.',
  newValidityDateMustDiffer: 'New Validity Date must differ from the current Validity Date.',
  amendmentReasonRequired: 'Reason is required.',
  amendmentSuccess: 'Validity Date amended successfully.',

  // Unauthorize Workflow
  unauthorizeConfirm: 'Are you sure you want to un-authorize this document?',
  unauthorizeSuccess: 'Document un-authorized successfully.',

  // Negotiation Workflow
  savingAmountNegative: (row: string | number) => `Saving amount cannot be negative for Row ${row}.`,
  expectedTermRequired: (tncHead: string) =>
    `Expected Term is required for selected Terms & Condition: ${tncHead}.`,
  expectedAmountRequired: (taxName: string) =>
    `Expected amount is required for Other Charge: ${taxName}.`,
  negotiationDraftSuccess: 'Negotiation saved as draft successfully!',
  negotiationSendSuccess: 'Negotiation saved and sent successfully!',

  // Approval & Document Actions
  selectApprovalSetup: 'Select Approval Setup.',
  deleteConfirm: 'Are you sure you want to delete?',
  deleteSuccess: 'Record deleted successfully.',
};

