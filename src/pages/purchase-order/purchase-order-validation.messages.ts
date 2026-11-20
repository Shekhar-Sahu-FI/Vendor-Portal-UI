/**
 * Validation and workflow alert messages for Purchase Order (PO).
 * Matches e-procurement-user-interface/src/pages/purchase/purchase-order/form-components/use-purchase-order-form.ts
 * and related components.
 */
export const PURCHASE_ORDER_VALIDATION_MESSAGES = {
  // Document Series & Header
  selectCompany: 'Select Company.',
  selectDivision: 'Select Division.',
  selectDocType: 'Select Doc. Type.',
  selectPoDate: 'Select PO Date.',
  enterPoNo: 'Enter PO No.',
  rollbackedDocStatus: 'Document is rollbacked, you cannot perform any action.',

  // General Detail
  selectExpenditureType: 'Select Expenditure Type.',
  selectRefDocType: 'Select Ref. Doc. Type.',
  selectRefDocNo: 'Select Ref. Doc. No.',
  selectVendor: 'Select Vendor.',
  selectVendorLocation: 'Select Vendor Location.',
  vendorLocationDiffersFromCs: 'Selected Vendor Location differs from CS-linked items.',
  selectValidityDate: 'Select Validity Date.',
  poDateBeforeValidityDate: 'PO Date must be before Validity Date.',
  selectDepartment: 'Select Department.',
  enterPartyRefNo: 'Enter Party Ref. No.',
  selectPartyRefDate: 'Select Party Ref. Date.',
  selectErpSerialNo: 'Select ERP Serial No.',
  selectPriority: 'Select Priority.',
  remarksOverwriteConfirm: 'Remarks already exist in PO. Do you want to replace?',

  // Item Detail
  selectAtLeastOneItem: 'Select at least one item',
  duplicateItemNotAllowed: 'Duplicate Item is not allowed.',
  enterQty: 'Enter Qty.',
  itemQtyReducedBelowGrn: (lineNo: number | string) =>
    `Item Qty. cannot be reduced below GRN Qty. for line no. ${lineNo}.`,
  enterRate: 'Enter Rate.',
  selectUnit: 'Select Unit.',
  enterHsn: 'Enter HSN.',
  hsnCodeFormat: 'HSN Code must be a number of length 2, 4, 6, or 8.',
  selectMake: 'Select Make.',
  enterTechSpec: 'Enter Technical Specification.',
  selectCostCenter: 'Select Cost Center.',
  cannotLinkCsWhenQuotation: 'Cannot link CS when Ref. Doc. Type is Quotation with CS.',

  // Tolerance & Conversion Factor
  toleranceMinusPercentage: 'Tolerance Minus must be between 0 and 100.',
  toleranceMinusQuantity: (qty: number | string, rowNo?: number | string) =>
    rowNo
      ? `Tolerance Minus must be between 0 and ${qty} for Row No. ${rowNo}.`
      : `Tolerance Minus must be between 0 and ${qty}.`,
  firstCfEmptyOrZero: 'FirstCF cannot be empty or zero.',
  secondCfEmptyOrZero: 'SecondCF cannot be empty or zero.',

  // Delivery Schedule & Bulk Schedule
  selectScheduleForItem: (itemName: string, rowNo: number | string) =>
    `Select schedule for Item ${itemName} at Row No. ${rowNo}`,
  selectScheduleDateForItem: (itemName: string, rowNo: number | string) =>
    `Select schedule date for Item ${itemName} at Row No. ${rowNo}.`,
  scheduleDateBeforeDocDate: (rowNo: number | string, isAmendment: boolean = false) =>
    `Schedule Date cannot be earlier than ${isAmendment ? 'Amendment' : 'Document'} Date for Row No. ${rowNo}.`,
  scheduleDateExceedsValidity: (rowNo: number | string) =>
    `Schedule Date cannot exceed Validity Date for Row No. ${rowNo}.`,
  totalScheduleQtyMustMatch: (
    totalQty: string | number,
    itemQty: string | number,
    itemName: string,
    rowNo: number | string,
  ) =>
    `Total Schedule Qty. (${totalQty}) must match Item Qty. (${itemQty}) for Item "${itemName}" at Row No. ${rowNo}.`,
  bulkScheduleDateRequired: 'Please select a schedule date.',
  bulkScheduleDateEarlier: (dateType: string, dateStr: string) =>
    `Schedule Date cannot be earlier than ${dateType} Date (${dateStr}).`,
  bulkScheduleDateExceeds: (dateStr: string) =>
    `Schedule Date cannot exceed Validity Date (${dateStr}).`,

  // Tax & GST
  multipleTaxesSameGroup: (rowNo: number | string) =>
    `Multiple taxes from the same Tax Group are not allowed in Row No. ${rowNo}.`,
  gstMismatchHsn: (hsn: string) =>
    `GST must be the same for all items with HSN "${hsn}".`,
  discountPercentageExceed100: (rowNo: number | string) =>
    `Discount percentage cannot exceed 100% at Row No. ${rowNo}.`,
  taxOnItemNotSelected: (taxName: string) =>
    `Tax ${taxName} is charged On Item but not selected for any item.`,
  selectAtLeastOneGst: 'Select at least one GST Tax.',
  discountTaxAmountExceedsBasic:
    'Discount tax amount cannot exceed the basic amount of the purchase order.',
  gstSgstUt: 'SGST should not be applied for Union Territory transactions.',
  gstOnlyUgstCgstUt: 'Only UGST and CGST are allowed for Union Territory transactions.',
  gstUgstNonUt: 'UGST should not be applied for non-Union Territory transactions.',
  gstOnlySgstCgstIntra: 'Only SGST and CGST are allowed for intra-state transactions.',
  gstOnlyIgstInter: 'Only IGST should be applied for inter-state transactions.',

  // Shipping & Transportation Route
  selectCarrierType: 'Select Carrier Type.',
  selectPaymentMode: 'Select Payment Mode.',
  selectDueBasis: 'Select Due Basis.',
  freightTypeRequired: 'Freight Type is required.',
  freightRateTypeRequired: 'Freight Rate Type is required when Freight Type is TO PAY.',
  freightAmountRequired: 'Freight Amount is required when Freight Type is TO PAY.',
  freightAmountGreaterThanZero: 'Freight Amount must be greater than 0.',
  selectConsigneeLocation: 'Select Consignee Location.',
  selectFromLocation: 'Select From Location.',
  selectToLocation: 'Select To Location.',
  enterDueDays: 'Enter Due Days.',
  dueDaysCannotBeEnteredWithRoute:
    'Due Days cannot be entered when Transportation Route is applicable.',
  dueDaysGreaterThanZero: 'Due Days must be greater than 0.',
  transportationRouteRequired: 'Transportation Route is required.',
  selectTransportationRouteLevel: 'Select Transportation Route Level.',
  selectRouteMode: (rowNo: number | string) => `Select Mode for Row No. ${rowNo}.`,
  selectRouteFreightType: (rowNo: number | string) =>
    `Select Freight Type for Row No. ${rowNo}.`,
  selectRouteFromLocation: (rowNo: number | string) =>
    `Select From Location for Row No. ${rowNo}.`,
  selectRouteToLocation: (rowNo: number | string) =>
    `Select To Location for Row No. ${rowNo}.`,
  routeItemRequired: (rowNo: number | string) =>
    `Item is required when Transportation Route Level is Item Level for Row No. ${rowNo}.`,
  routeRecipientRequired: (rowNo: number | string) =>
    `Recipient is required for Row No. ${rowNo} in Transportation Route.`,

  // Payment Terms & Expenses
  selectPaymentTerms: 'Select Payment Terms.',
  totalPaymentPercentage100: 'Total Payment Percentage must be 100%.',
  duplicatePaymentSequence: 'Duplicate Payment Sequence is not allowed.',
  paymentTermsSequenceOrder:
    'Payment Terms must follow the sequence: Down Payment → Down Payment PI → Against Bill.',
  duplicateExpense: (rowNo: number | string) =>
    `Duplicate Expense is not allowed in Row No. ${rowNo}.`,

  // Currency & Linking
  selectCurrency: 'Select Currency.',
  enterExchangeRate: 'Enter Exchange Rate.',
  exchangeRateCannotBeZero: 'Exchange Rate cannot be 0.',
  prItemStatusNonActive: (prDocNo: string, statusName: string, rowNo: number | string) =>
    `PR Detail ${prDocNo} cannot be added as Item Status is ${statusName} for Row No. ${rowNo}.`,
  prItemUnselectGrn: (prDocNo: string, rowNo: number | string) =>
    `PR Detail ${prDocNo} cannot be unselected as GRN exists for Row No. ${rowNo}.`,
  prItemMoveGrn: (prDocNo: string, rowNo: number | string) =>
    `PR Detail ${prDocNo} cannot be moved as GRN exists for Row No. ${rowNo}.`,
  prSameItemDifferentUnit: 'Items with same Make/Item cannot have different PO Units.',
  poQtyGreaterThanBalance: 'PO Qty. can not be greater than Balance Qty.',
  poQtyCannotBeEmptyOrZero: 'PO Qty. can not be empty or zero.',
  prQtyReducedBelowGrn: (lineNo: number | string) =>
    `PR Qty. cannot be reduced below GRN Qty. for line no. ${lineNo}.`,
  csSelectItems: 'Select Item.',
  csAllSameLocation: 'All selected CS must belong to the same Vendor Location.',
  csLocationChangeBlockedAmendment:
    'Vendor Location cannot be changed during Purchase Order Amendment.',
  csLocationDiffersConfirm:
    'Selected CS Vendor Location differs from current Purchase Order Vendor Location. Do you want to replace it and proceed?',
  csCurrencyMismatch: (poCurrency: string, csCurrency: string, rowNo: number | string) =>
    `PO Currency (${poCurrency}) does not match Quotation Currency (${csCurrency}) for Row ${rowNo}.`,
  csTaxConflictConfirm: (taxName: string, rowNo: number | string) =>
    `Same Tax "${taxName}" has different detail in Row No. ${rowNo}. Do you want to continue and apply CS defined Tax?`,

  // Amendment & Actions
  enterAmendmentReason: 'Enter Amendment Reason.',
  selectAmendmentDate: 'Select Amendment Date.',
  amendmentDateEarlierThanPoDate: 'Amendment Date cannot be earlier than PO Date.',
  amendmentDateEarlierThanPrDate: (prDate: string) =>
    `Amendment Date cannot be earlier than Purchase Request Date ${prDate}.`,
  selectApprovalSetup: 'Select Approval Setup.',
  deleteConfirm: 'Are you sure you want to delete?',
  deleteSuccess: 'Successfully deleted.',
};
