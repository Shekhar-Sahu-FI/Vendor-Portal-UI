import { Page } from '@playwright/test';
import { AutoSuggestField, SelectField } from '../../../types/purchase-order.types';
import { DOCUMENT_DETAIL_LABELS as L } from '../purchase-order.constants';
import { fillTextField, selectOption } from '../../../utils/field-accessor';
import { fillDateByLabel } from '../../../utils/date-calendar.helper';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class PurchaseOrderDocumentDetailSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async fillCompany(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.company, field.query, field.value);
  }

  async fillDivision(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.division, field.query, field.value);
  }

  async fillDocumentType(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.documentType, field.query, field.value);
  }

  async fillDocumentDate(value: string) {
    await fillDateByLabel(this.page, L.documentDate, value);
  }

  async fillDocumentNo(value: string) {
    await fillTextField(this.page, L.documentNo, value);
  }

  async fillDocumentStatus(statusLabel: string) {
    await selectOption(this.page, L.documentStatus, statusLabel);
  }

  async fillAll(data: {
    company?: AutoSuggestField;
    division?: AutoSuggestField;
    documentType?: AutoSuggestField;
    documentDate?: string;
    documentNo?: string;
    documentStatus?: string | SelectField;
  } = {}): Promise<void> {
    console.log(data, "this is documetn detail data")
    if (data.company) await this.fillCompany(data.company);
    if (data.division) await this.fillDivision(data.division);
    if (data.documentType) await this.fillDocumentType(data.documentType);
    if (this.hasValue(data.documentDate)) await this.fillDocumentDate(data.documentDate);
    if (this.hasValue(data.documentNo)) await this.fillDocumentNo(data.documentNo);
    const statusLabel =
      typeof data.documentStatus === 'string' ? data.documentStatus : data.documentStatus?.value;
    if (this.hasValue(statusLabel)) await this.fillDocumentStatus(statusLabel);
  }
}
