/**
 * Validation messages from use-quotation.ts (validation engine schema) and quotation form components.
 */
export const QUOTATION_VALIDATION_MESSAGES = {
  // General Detail / Header
  quotationNoRequired: 'Quotation No. is required',
  quotationDateRequired: 'Quotation Date is required',
  validityDateRequired: 'Validity Date is required',
  validityBeforeQuotationDate: 'Validity Date cannot be before Quotation Date',
  creditDaysRequired: 'Credit Days is required',
  creditDaysGreaterThanZero: 'Credit Days must be greater than 0',
  freightTypeRequired: 'Freight Type is required',
  paymentModeRequired: 'Payment Mode is required',
  currencyRequired: 'Currency is required',
  countryRequired: 'Country is required',
  stateRequired: 'State is required',

  // Items Section
  atLeastOneItemSelected: 'Atleast one item must be selected to proceed',
  hsnRequired: 'HSN/SAC is required.',
  hsnCodeFormat: 'HSN Code must be a number of length 2, 4, 6, or 8.',
  makeRequired: 'Make is required.',
  otherMakeRequired: 'Other Make Name is required.',
  rateRequired: 'Rate is required.',
  discountPercentMax: 'Disc. % cannot be greater than 100.',
  taxRequired: 'Tax is required.',
  deliveryDaysRequired: 'Delivery Days is required.',
  rowTotalNegative: (row: number) => `Total Amount cannot be less than 0 for Row No. ${row}`,

  // Other Charges & Net Amount
  netAmountNegative: 'Net Amount cannot be less than 0.',

  // Terms & Conditions
  tncResponseRequired: (headName: string) => `Response for ${headName} is required.`,

  // Inform To Detail
  contactPersonNameRequired: 'Contact Person Name is required.',
  emailOrContactNoRequired: 'Email or Contact No. is required.',
  invalidEmail: 'Enter a valid email.',

  // Form Submissions & Alerts
  validationNotice: 'Please correct the errors before submitting.',
  quotationSavedSuccess: (docNo: string) => `Doc No. : ${docNo}`,
  declineSuccess: 'You have declined to participate in this RFQ.',
  undoDeclineSuccess: 'You have accepted to participate in this RFQ.',
  withdrawSuccess: 'You have withdrawn from this RFQ.',
  deleteSuccess: 'Quotation deleted successfully!',
  negotiationAcceptedSuccess: 'Negotiation accepted successfully.',
};
