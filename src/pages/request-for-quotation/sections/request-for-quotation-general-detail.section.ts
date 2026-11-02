import { Page } from '@playwright/test';
import { AutoSuggestField, SelectField } from '../../../types/purchase-order.types';
import { GENERAL_DETAIL_LABELS as L } from '../request-for-quotation.constants';
import { fillTextField, getFieldContainer } from '../../../utils/field-accessor';
import { fillDateByLabel } from '../../../utils/date-calendar.helper';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class RequestForQuotationGeneralDetailSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private resolveSelectValue(value?: string | SelectField): string | undefined {
    if (!value) return undefined;
    return typeof value === 'string' ? value : value.value;
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async fillSourceDocumentType(value: string) {
    await this.fields.selectDropdownByLabel(L.sourceDocument, value);
  }

  async fillSourceDocumentTypeById(id: number) {
    const select = getFieldContainer(this.page, L.sourceDocument).locator('select').first();
    await select.selectOption({ value: String(id) });
  }

  async fillDueDate(value: string) {
    await fillDateByLabel(this.page, L.dueDate, value);
  }

  async setIsPriceList(checked: boolean) {
    const checkbox = this.page.getByRole('checkbox', { name: L.isPriceList });
    if (checked) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

  async fillContactPersonName(field: AutoSuggestField | string) {
    if (typeof field === 'string') {
      await fillTextField(this.page, L.contactPersonName, field);
      return;
    }
    await this.fields.selectInputSuggestion(L.contactPersonName, field.query, field.value);
  }

  async fillAll(data: {
    sourceDocumentType?: string | SelectField;
    sourceDocumentTypeId?: number;
    dueDate?: string;
    isPriceList?: boolean;
    contactPersonName?: AutoSuggestField | string;
    contactEmail?: string;
    remarks?: string;
  } = {}): Promise<void> {
    if (typeof data.sourceDocumentTypeId === 'number') {
      await this.fillSourceDocumentTypeById(data.sourceDocumentTypeId);
    } else {
      const sourceDocumentType = this.resolveSelectValue(data.sourceDocumentType);
      if (this.hasValue(sourceDocumentType)) {
        await this.fillSourceDocumentType(sourceDocumentType);
      }
    }
    if (this.hasValue(data.dueDate)) {
      await this.fillDueDate(data.dueDate);
    }
    if (typeof data.isPriceList === 'boolean') {
      await this.setIsPriceList(data.isPriceList);
    }
    if (data.contactPersonName) {
      await this.fillContactPersonName(data.contactPersonName);
    }
    if (this.hasValue(data.contactEmail)) {
      await fillTextField(this.page, L.contactEmail, data.contactEmail);
    }
    if (this.hasValue(data.remarks)) {
      await fillTextField(this.page, L.remarks, data.remarks);
    }
  }
}
