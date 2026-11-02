/**
 * RFQ form field limits from e-procurement UI + validation schema.
 * @see request-for-quotation/components/*.tsx, use-request-for-quotation.ts
 */
export type RfqFieldLimitCheckType =
  | 'labeledInput'
  | 'labeledTextarea'
  | 'mailSubject'
  | 'gridInput'
  | 'gridTextarea'
  | 'saveValidation';

export interface RfqFieldLimitSpec {
  id: string;
  section: string;
  label: string;
  checkType: RfqFieldLimitCheckType;
  /** Human-readable limit for the report */
  limitDescription: string;
  maxLength?: number;
  /** Grid row index (default 0) */
  rowIndex?: number;
  columnId?: string;
  overlayPlaceholder?: string;
  /** For number cells: max digit/char length (e.g. qty maxLength 9) */
  maxNumericLength?: number;
  decimalPlaces?: number;
  /** Save-time validation message when exceeding maxLength */
  overLimitMessage?: string | RegExp;
  /** Sample value within limit for numeric checks */
  validNumericSample?: string;
  /** Value that should exceed numeric limit */
  invalidNumericSample?: string;
}

export const RFQ_FIELD_LIMIT_SPECS: RfqFieldLimitSpec[] = [
  {
    id: 'general.contactEmail',
    section: 'General Detail',
    label: 'Contact Person Email',
    checkType: 'labeledInput',
    limitDescription: 'max 320 characters (input)',
    maxLength: 320,
  },
  {
    id: 'general.remarks.ui',
    section: 'General Detail',
    label: 'Remarks',
    checkType: 'labeledTextarea',
    limitDescription: 'max 1000 characters (input)',
    maxLength: 1000,
  },
  {
    id: 'mail.mailSubject.ui',
    section: 'Mail Subject',
    label: 'Mail Subject',
    checkType: 'mailSubject',
    limitDescription: 'max 500 characters (input)',
    maxLength: 500,
  },
  {
    id: 'item.techSpecification',
    section: 'Item Detail',
    label: 'Tech Spec',
    checkType: 'gridTextarea',
    limitDescription: 'max 1000 characters',
    maxLength: 1000,
    rowIndex: 0,
    columnId: 'techSpecification',
    overlayPlaceholder: 'Enter Description',
  },
  {
    id: 'item.qty.maxLength',
    section: 'Item Detail',
    label: 'Qty (max digits)',
    checkType: 'gridInput',
    limitDescription: 'max 9 characters',
    maxNumericLength: 9,
    rowIndex: 0,
    columnId: 'qty',
    validNumericSample: '123456789',
    invalidNumericSample: '1234567890',
  },
  {
    id: 'item.qty.decimalPlaces',
    section: 'Item Detail',
    label: 'Qty (decimal places)',
    checkType: 'gridInput',
    limitDescription: 'max 3 decimal places',
    decimalPlaces: 3,
    rowIndex: 0,
    columnId: 'qty',
    validNumericSample: '1.234',
    invalidNumericSample: '1.2345',
  },
  {
    id: 'item.remarks',
    section: 'Item Detail',
    label: 'Remarks',
    checkType: 'gridTextarea',
    limitDescription: 'max 500 characters',
    maxLength: 500,
    rowIndex: 0,
    columnId: 'remarks',
    overlayPlaceholder: 'Enter Remarks',
  },
  {
    id: 'general.remarks.save',
    section: 'General Detail',
    label: 'Remarks (save validation)',
    checkType: 'saveValidation',
    limitDescription: 'max 500 characters on save',
    maxLength: 500,
    overLimitMessage: /Remarks must be less than 500 characters/i,
  },
  {
    id: 'mail.mailSubject.save',
    section: 'Mail Subject',
    label: 'Mail Subject (save validation)',
    checkType: 'saveValidation',
    limitDescription: 'max 500 characters on save',
    maxLength: 500,
    overLimitMessage: /Mail Subject must be less than 500 characters/i,
  },
];
