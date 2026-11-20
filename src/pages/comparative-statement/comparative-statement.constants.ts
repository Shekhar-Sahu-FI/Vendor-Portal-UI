export const COMPARATIVE_STATEMENT_ROUTES = {
  list: (role: string = 'company') => `/${role}/transaction/comparative-statement`,
  new: (role: string = 'company') => `/${role}/transaction/comparative-statement/new`,
  edit: (id: number | string, role: string = 'company') =>
    `/${role}/transaction/comparative-statement/${id}/edit`,
  display: (id: number | string, role: string = 'company') =>
    `/${role}/transaction/comparative-statement/${id}`,
  print: (id: number | string, role: string = 'company') =>
    `/${role}/transaction/comparative-statement/${id}/print`,
};

export const COMPARATIVE_STATEMENT_LABELS = {
  csNo: 'CS No.',
  csDate: 'CS Date',
  docType: 'Doc. Type',
  refDocType: 'Ref. Doc. Type',
  rfqNo: 'RFQ No.',
  rfqDate: 'RFQ Date',
  refCsNo: 'Ref. CS No.',
  refCsDate: 'Ref. CS Date',
  vendorSelectionBasis: 'Vendor Selection Basis',
  validityDate: 'Validity Date',
  remarks: 'Remarks',
  save: 'Save',
  cancel: 'Cancel',
  delete: 'Delete',
  unauthorize: 'Un-Authorize',
  amendValidityDate: 'Amend Validity Date',
  makeMapping: 'Make Mapping',
};

export const REF_DOC_TYPES = {
  RFQ: 1,
  CS: 2,
};

export const VENDOR_SELECTION_BASIS = {
  QuotationWise: 1,
  ItemWise: 2,
};

export const COMPARATIVE_STATEMENT_GRID = {
  docNoColumn: 'docNoYearly',
  csDateColumn: 'docDate',
  validityDateColumn: 'validityDate',
  refDocNoColumn: 'refDocNo',
  docStatusColumn: 'docStatusId',
};

