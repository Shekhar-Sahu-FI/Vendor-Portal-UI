import { Page } from '@playwright/test';
import { AutoSuggestField, SelectField } from '../../../types/purchase-order.types';
import { SHIPPING_DETAIL_LABELS as L } from '../purchase-order.constants';
import { fillTextField } from '../../../utils/field-accessor';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class PurchaseOrderShippingDetailSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  private resolveSelectValue(value?: string | SelectField): string | undefined {
    if (!value) return undefined;
    return typeof value === 'string' ? value : value.value;
  }

  private async fillSuggestionIfPresent(label: string, field?: AutoSuggestField): Promise<void> {
    if (!field) return;
    const query = this.hasValue(field.query) ? field.query : undefined;
    const value = this.hasValue(field.value) ? field.value : undefined;
    if (!query || !value) return;
    await this.fields.selectInputSuggestion(label, query, value);
  }

  async fillAll(data: {
    vehicleType?: SelectField;
    paymentMode?: SelectField;
    dueBasis?: SelectField;
    dueDays?: number;
    freightType?: SelectField;
    freightRateType?: SelectField;
    freightAmount?: number;
    priority?: AutoSuggestField;
    fromLocation?: AutoSuggestField;
    toLocation?: AutoSuggestField;
    consigneeLocation?: AutoSuggestField;
  } = {}): Promise<void> {

    const vehicleType = this.resolveSelectValue(data.vehicleType);
    if (this.hasValue(vehicleType)) await this.fields.selectDropdownByLabel(L.carrierType, vehicleType);

    const paymentMode = this.resolveSelectValue(data.paymentMode);
    if (this.hasValue(paymentMode)) await this.fields.selectDropdownByLabel(L.paymentMode, paymentMode);

    const dueBasis = this.resolveSelectValue(data.dueBasis);
    if (this.hasValue(dueBasis)) await this.fields.selectDropdownByLabel(L.dueBasis, dueBasis);

    if (data.dueDays !== undefined && data.dueDays !== null) {
      await fillTextField(this.page, L.dueDays, String(data.dueDays));
    }

    const freightType = this.resolveSelectValue(data.freightType);
    if (this.hasValue(freightType)) await this.fields.selectDropdownByLabel(L.freightType, freightType);

    const freightRateType = this.resolveSelectValue(data.freightRateType);
    if (this.hasValue(freightRateType)) {
      await this.fields.selectDropdownByLabel(L.freightRate, freightRateType);
    }

    if (data.freightAmount !== undefined && data.freightAmount !== null) {
      await fillTextField(this.page, L.freightAmount, String(data.freightAmount));
    }

    if (data.priority) await this.fillSuggestionIfPresent(L.priority, data.priority);
    if (data.fromLocation) await this.fillSuggestionIfPresent(L.fromLocation, data.fromLocation);
    if (data.toLocation) await this.fillSuggestionIfPresent(L.toLocation, data.toLocation);
    if (data.consigneeLocation) {
    
      await this.fillSuggestionIfPresent(L.consigneeLocation, data.consigneeLocation);
    }
  }
}
