import { expect, Page } from '@playwright/test';
import { AutoSuggestField } from '../../../types/item-master.types';
import { GENERAL_DETAIL_LABELS as L } from '../item-master.constants';
import { fillTextField, getInputsByLabel } from '../../../utils/field-accessor';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class ItemMasterGeneralDetailSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async fillSubgroup(field: AutoSuggestField): Promise<void> {
    const nextCodePromise = this.page
      .waitForResponse(
        (response) =>
          /next-code/i.test(response.url())
          && response.request().method() === 'GET'
          && response.ok(),
        { timeout: 30_000 },
      )
      .catch(() => null);

    await this.fields.selectInputSuggestion(L.subgroupName, field.query, field.value);
    await nextCodePromise;

    const codeInput = getInputsByLabel(this.page, L.code);
    await expect.poll(async () => (await codeInput.inputValue()).trim().length).toBeGreaterThanOrEqual(4);
  }

  async fillStockUnit(field: AutoSuggestField): Promise<void> {
    await this.fields.selectInputSuggestion(L.stockUnit, field.query, field.value);
  }

  async fillAll(data: {
    subgroup?: AutoSuggestField;
    itemName?: string;
    stockUnit?: AutoSuggestField;
    gstCategory?: string;
    hsnSacCode?: string;
    remarks?: string;
  } = {}): Promise<void> {
    if (data.subgroup) {
      await this.fillSubgroup(data.subgroup);
    }
    if (this.hasValue(data.itemName)) {
      await fillTextField(this.page, L.itemName, data.itemName);
    }
    if (data.stockUnit) {
      await this.fillStockUnit(data.stockUnit);
    }
    if (this.hasValue(data.gstCategory)) {
      await this.fields.selectDropdownByLabel(L.gstCategory, data.gstCategory);
    }
    if (this.hasValue(data.hsnSacCode)) {
      await fillTextField(this.page, L.hsnSacCode, data.hsnSacCode);
    }
    if (this.hasValue(data.remarks)) {
      await fillTextField(this.page, L.remarks, data.remarks);
    }
  }
}
