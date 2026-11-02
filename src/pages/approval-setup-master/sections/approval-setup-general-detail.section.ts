import { Page } from '@playwright/test';
import { AutoSuggestField } from '../../../types/approval-setup-master.types';
import { GENERAL_DETAIL_LABELS as L } from '../approval-setup-master.constants';
import { fillTextField } from '../../../utils/field-accessor';
import { fillDateByLabel } from '../../../utils/date-calendar.helper';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class ApprovalSetupGeneralDetailSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async fillApprovalSetupName(value: string): Promise<void> {
    await fillTextField(this.page, L.approvalSetupName, value);
  }

  async fillFormName(field: AutoSuggestField): Promise<void> {
    const orgUnitsPromise = this.page
      .waitForResponse(
        (response) =>
          /companies|divisions|department/i.test(response.url())
          && response.request().method() === 'GET'
          && response.ok(),
        { timeout: 30_000 },
      )
      .catch(() => null);
    const docTypesPromise = this.page
      .waitForResponse(
        (response) =>
          /doc-types\/forms/i.test(response.url())
          && response.request().method() === 'GET'
          && response.ok(),
        { timeout: 30_000 },
      )
      .catch(() => null);

    await this.fields.selectInputSuggestion(L.formName, field.query, field.value);
    await orgUnitsPromise;
    await docTypesPromise;
  }

  async fillAll(data: {
    approvalSetupName?: string;
    formName?: AutoSuggestField;
    approvalScope?: string;
    minNetAmount?: string;
    maxNetAmount?: string;
    description?: string;
    fromDate?: string;
    toDate?: string;
  } = {}): Promise<void> {
    if (this.hasValue(data.approvalSetupName)) {
      await this.fillApprovalSetupName(data.approvalSetupName);
    }
    if (data.formName) {
      await this.fillFormName(data.formName);
    }
    if (this.hasValue(data.approvalScope)) {
      await this.fields.selectDropdownByLabel(L.approvalScope, data.approvalScope);
    }
    if (this.hasValue(data.minNetAmount)) {
      await fillTextField(this.page, L.minNetAmount, data.minNetAmount);
    }
    if (this.hasValue(data.maxNetAmount)) {
      await fillTextField(this.page, L.maxNetAmount, data.maxNetAmount);
    }
    if (this.hasValue(data.description)) {
      await fillTextField(this.page, L.description, data.description);
    }
    if (this.hasValue(data.fromDate)) {
      await fillDateByLabel(this.page, L.fromDate, data.fromDate);
    }
    if (this.hasValue(data.toDate)) {
      await fillDateByLabel(this.page, L.toDate, data.toDate);
    }
  }
}
