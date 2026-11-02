import { Page } from '@playwright/test';
import { AutoSuggestField, SelectField } from '../../../types/purchase-order.types';
import { GENERAL_DETAIL_LABELS as L } from '../purchase-order.constants';
import { fillTextField, getFieldContainer } from '../../../utils/field-accessor';
import { fillDateByLabel } from '../../../utils/date-calendar.helper';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class PurchaseOrderGeneralDetailSection {
  private resolveSelectValue(value?: string | SelectField): string | undefined {
    if (!value) return undefined;
    return typeof value === 'string' ? value : value.value;
  }

  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async fillExpenditureType(value: string) {
    await this.fields.selectDropdownByLabel(L.expenditureType, value);
  }

  async fillReferenceDocumentType(value: string) {
    await this.fields.selectDropdownByLabel(L.referenceDocumentType, value);
  }

  async fillReferenceDocumentTypeById(id: number) {
    const select = getFieldContainer(this.page, L.referenceDocumentType).locator('select').first();
    await select.selectOption({ value: String(id) });
  }

  async fillReferenceDocumentNo(value: string) {
    await fillTextField(this.page, L.referenceDocumentNo, value);
  }

  async fillVendor(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.vendorName, field.query, field.value);
  }

  async fillVendorLocation(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.vendorLocation, field.query, field.value);
  }

  async fillContactPerson(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.contactPersonName, field.query, field.value);
  }

  async fillDepartment(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.departmentName, field.query, field.value);
  }

  async fillAll(data: {
    expenditureType?: string | SelectField;
    referenceDocumentType?: string | SelectField;
    referenceDocumentTypeId?: number;
    referenceDocumentNo?: string;
    vendor?: AutoSuggestField;
    vendorLocation?: AutoSuggestField;
    contactPerson?: AutoSuggestField;
    validityDate?: string;
    department?: AutoSuggestField;
    partyReferenceNo?: string;
    partyReferenceDate?: string;
    erpSerialNo?: string;
    remarks?: string;
  } = {}): Promise<void> {
   
    const expenditureType = this.resolveSelectValue(data.expenditureType);
    if (this.hasValue(expenditureType)) await this.fillExpenditureType(expenditureType);
    if (typeof data.referenceDocumentTypeId === 'number') {
      await this.fillReferenceDocumentTypeById(data.referenceDocumentTypeId);
    } else {
      const referenceDocumentType = this.resolveSelectValue(data.referenceDocumentType);
      if (this.hasValue(referenceDocumentType)) {
        await this.fillReferenceDocumentType(referenceDocumentType);
      }
    }
    if (this.hasValue(data.referenceDocumentNo)) await this.fillReferenceDocumentNo(data.referenceDocumentNo);
    if (data.vendor) await this.fillVendor(data.vendor);
    if (data.vendorLocation) await this.fillVendorLocation(data.vendorLocation);
    if (data.contactPerson) await this.fillContactPerson(data.contactPerson);
    if (this.hasValue(data.validityDate)) await fillDateByLabel(this.page, L.validityDate, data.validityDate);
    if (data.department) await this.fillDepartment(data.department);
    if (this.hasValue(data.partyReferenceNo)) await fillTextField(this.page, L.partyReferenceNo, data.partyReferenceNo);
    if (this.hasValue(data.partyReferenceDate)) {
      await fillDateByLabel(this.page, L.partyReferenceDate, data.partyReferenceDate);
    }

       if (this.hasValue(data.erpSerialNo)) await this.fields.selectErpSerialNo(data.erpSerialNo);
    if (this.hasValue(data.remarks)) await fillTextField(this.page, L.remarks, data.remarks);
  }
}
