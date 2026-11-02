import { Page } from '@playwright/test';
import {
  fillTextField,
  getInputsByLabel,
  selectFirstDropdownOption,
  selectOption,
} from './field-accessor';
import { selectFromAutoSuggestion } from './auto-suggestion.helper';

/**
 * Form interactions using label-based field accessors (UCTextBox, UCDropDown, UCInputSuggestions).
 */
export class FormFieldHelper {
  constructor(private readonly page: Page) {}

  async fillTextByLabel(label: string, value: string) {
    await fillTextField(this.page, label, value);
  }

  async fillTextByName(name: string, value: string) {
    await this.page.locator(`[name="${name}"]`).fill(value);
  }

  async selectInputSuggestion(label: string, searchText: string, valueToSelect?: string) {
    const inputs = getInputsByLabel(this.page, label);
    await selectFromAutoSuggestion(
      this.page,
      inputs,
      searchText,
      valueToSelect ?? searchText,
    );
  }

  async selectDropdownByLabel(label: string, optionLabel: string) {
    await selectOption(this.page, label, optionLabel);
  }

  async selectErpSerialNo(optionLabel?: string) {
    const isVisible = await this.page
      .locator('label:has-text("ERP Serial No.")')
      .isVisible()
      .catch(() => false);
    if (!isVisible) {
      return;
    }
    if (optionLabel) {
      await selectOption(this.page, 'ERP Serial No.', optionLabel);
    } else {
      await selectFirstDropdownOption(this.page, 'ERP Serial No.');
    }
  }
}
