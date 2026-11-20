export const QUOTATION_ROUTES = {
  list: (role: string = 'vendor') => `/${role}/transaction/quotation`,
  new: (publicId?: string, role: string = 'vendor') =>
    publicId
      ? `/${role}/transaction/quotation/${publicId}/new`
      : `/${role}/transaction/quotation/new`,
  edit: (id: number | string, role: string = 'vendor') =>
    `/${role}/transaction/quotation/${id}/edit`,
  display: (id: number | string, role: string = 'vendor') =>
    `/${role}/transaction/quotation/${id}`,
  print: (id: number | string, role: string = 'vendor') =>
    `/${role}/transaction/quotation/${id}/print`,
  resolve: (publicId: string, role: string = 'vendor') =>
    `/${role}/transaction/quotation/resolve/${publicId}`,
};

export const QUOTATION_LABELS = {
  quotationNo: 'Quotation No.',
  quotationDate: 'Quotation Date',
  validityDate: 'Validity Date',
  creditDays: 'Credit Days',
  freightType: 'Freight Type',
  paymentMode: 'Payment Mode',
  currency: 'Currency',
  remarks: 'Remarks',
  country: 'Country',
  state: 'State',
  defaultDeliveryDays: 'Default Delivery Day(s)',
  save: 'Save',
  submit: 'Submit',
  decline: 'Decline',
  undoDecline: 'Undo Decline',
  withdraw: 'Withdraw',
  undoWithdraw: 'Undo Withdraw',
  addQuotation: 'Add Quotation',
  cancel: 'Cancel',
};

export const QUOTATION_TABS = {
  generalDetail: 0,
  termsAndConditions: 1,
  attachment: 2,
  informTo: 3,
  negotiation: 4,
};

export const QUOTATION_GRID = {
  docNoColumn: 'docNoYearly',
  quotationDateColumn: 'docDate',
  rfqNoColumn: 'rfqNo',
};
