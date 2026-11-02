import { Page } from '@playwright/test';
import { AutoSuggestField } from '../../../types/purchase-request.types';
import { GENERAL_DETAIL_LABELS as L } from '../purchase-request.constants';
import { fillTextField } from '../../../utils/field-accessor';
import { fillDateByLabel } from '../../../utils/date-calendar.helper';
import { FormFieldHelper } from '../../../utils/form-field.helper';
import { ContactNumberFill, fillContactNumber } from '../../../utils/contact-number.helper';

export class PurchaseRequestGeneralDetailSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async fillDepartment(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.department, field.query, field.value);
  }

  async fillRequestedBy(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.requestedBy, field.query, field.value);
  }

  async fillRequestedContactNo(value: string | ContactNumberFill) {
    await fillContactNumber(this.page, L.requestedContactNo, value);
  }

  async fillAll(data: {
    department?: AutoSuggestField;
    requestedBy?: AutoSuggestField;
    requestedByEmail?: string;
    requestedContactNo?: string | ContactNumberFill;
    expenditureType?: string;
    erpSerialNo?: string;
    referenceNo?: string;
    referenceDate?: string;
    remarks?: string;
  } = {}): Promise<void> {
    if (data.department) await this.fillDepartment(data.department);
    if (this.hasValue(data.expenditureType)) {
      await this.fields.selectDropdownByLabel(L.expenditureType, data.expenditureType);
    }
    if (data.requestedBy) await this.fillRequestedBy(data.requestedBy);
    if (this.hasValue(data.requestedByEmail)) {
      await fillTextField(this.page, L.requestedByEmail, data.requestedByEmail);
    }
    if (data.requestedContactNo) {
      await this.fillRequestedContactNo(data.requestedContactNo);
    }
    if (this.hasValue(data.referenceNo)) {
      await fillTextField(this.page, L.referenceNo, data.referenceNo);
    }
    if (this.hasValue(data.referenceDate)) {
      await fillDateByLabel(this.page, L.referenceDate, data.referenceDate);
    }
    if (this.hasValue(data.erpSerialNo)) {
      await this.fields.selectErpSerialNo(data.erpSerialNo);
    }
    if (this.hasValue(data.remarks)) {
      await fillTextField(this.page, L.remarks, data.remarks);
    }
  }
}
