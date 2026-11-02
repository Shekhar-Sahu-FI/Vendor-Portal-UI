import { Page } from '@playwright/test';
import { SelectField } from '../../../types/purchase-order.types';
import { CURRENCY_DETAIL_LABELS as L } from '../purchase-order.constants';
import { fillTextField } from '../../../utils/field-accessor';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class PurchaseOrderCurrencyDetailSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  private resolveSuggestion(value?: string | SelectField): { query: string; value: string } | null {
    if (!value) return null;
    if (typeof value === 'string') {
      const normalized = value.trim();
      return normalized ? { query: normalized, value: normalized } : null;
    }
    const selectedValue = value.value?.trim();
    if (!selectedValue) return null;
    return {
      query: value.query?.trim() || selectedValue,
      value: selectedValue,
    };
  }

  async fillAll(data: { currency?: SelectField; exchangeRate?: number } = {}): Promise<void> {

    const currency = this.resolveSuggestion(data.currency);
    if (currency) {
      await this.fields.selectInputSuggestion(L.currency, currency.query, currency.value);
    }
    if (data.exchangeRate !== undefined && data.exchangeRate !== null) {
      await fillTextField(this.page, L.exchangeRate, String(data.exchangeRate));
    }
  }
}
