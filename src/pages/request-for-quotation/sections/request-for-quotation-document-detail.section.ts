import { Page } from '@playwright/test';
import { AutoSuggestField, SelectField } from '../../../types/purchase-order.types';
import { DOCUMENT_DETAIL_LABELS as L } from '../request-for-quotation.constants';
import { fillTextField, selectOption } from '../../../utils/field-accessor';
import { fillDateByLabel } from '../../../utils/date-calendar.helper';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class RequestForQuotationDocumentDetailSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async fillAll(data: {
    division?: AutoSuggestField;
    documentType?: AutoSuggestField;
    documentDate?: string;
    documentNo?: string;
    documentStatus?: string | SelectField;
  } = {}): Promise<void> {
    if (data.documentType) {
      await this.fields.selectInputSuggestion(L.documentType, data.documentType.query, data.documentType.value);
    }
    if (this.hasValue(data.documentDate)) {
      await fillDateByLabel(this.page, L.documentDate, data.documentDate);
    }
    if (this.hasValue(data.documentNo)) {
      await fillTextField(this.page, L.documentNo, data.documentNo);
    }
    const statusLabel =
      typeof data.documentStatus === 'string' ? data.documentStatus : data.documentStatus?.value;
    if (this.hasValue(statusLabel)) {
      await selectOption(this.page, L.documentStatus, statusLabel);
    }
  }
}
