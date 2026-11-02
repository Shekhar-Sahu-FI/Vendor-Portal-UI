import {
  gridDecimalPlaces,
  gridMaxDigits,
  gridTextMax,
  inputMax,
  saveMaxLength,
  textareaMax,
} from '../../utils/form-testing';
import {
  GENERAL_DETAIL_LABELS,
  MAIL_SUBJECT_LABELS,
} from './request-for-quotation.constants';
import { RFQ_ITEM_GRID_COLUMNS } from './grids/request-for-quotation-grid.columns';
import { fillTextField } from '../../utils/field-accessor';
import { RFQ_VALIDATION_MESSAGES as MSG } from './rfq-validation.messages';

const S = {
  general: 'General Detail',
  mail: 'Mail Subject',
  item: 'Item Detail',
};

export const RFQ_LIMIT_CHECKS = [
  inputMax('contactEmail', S.general, GENERAL_DETAIL_LABELS.contactEmail, 320),
  textareaMax('remarks', S.general, GENERAL_DETAIL_LABELS.remarks, 1000),
  inputMax('mailSubject', S.mail, MAIL_SUBJECT_LABELS.mailSubject, 500),
  gridTextMax(
    'itemTechSpec',
    S.item,
    'Tech Spec',
    RFQ_ITEM_GRID_COLUMNS,
    0,
    'techSpecification',
    1000,
    'Enter Description',
  ),
  gridMaxDigits('itemQtyDigits', S.item, 'Qty', RFQ_ITEM_GRID_COLUMNS, 0, 'qty', 9, '1234567890'),
  gridDecimalPlaces('itemQtyDecimal', S.item, 'Qty decimals', RFQ_ITEM_GRID_COLUMNS, 0, 'qty', 3, '1.2345'),
  gridTextMax(
    'itemRemarks',
    S.item,
    'Remarks',
    RFQ_ITEM_GRID_COLUMNS,
    0,
    'remarks',
    500,
    'Enter Remarks',
  ),
  saveMaxLength(
    'remarksSave',
    S.general,
    'Remarks (save)',
    500,
    async (page) => {
      const ta = page
        .locator(`label:has-text("${GENERAL_DETAIL_LABELS.remarks}")`)
        .locator('xpath=..')
        .locator('textarea')
        .first();
      await ta.fill('x'.repeat(501));
    },
    MSG.remarksMaxLength,
  ),
  saveMaxLength(
    'mailSubjectSave',
    S.mail,
    'Mail Subject (save)',
    500,
    async (page) => fillTextField(page, MAIL_SUBJECT_LABELS.mailSubject, 'x'.repeat(501)),
    MSG.mailSubjectMaxLength,
  ),
];
