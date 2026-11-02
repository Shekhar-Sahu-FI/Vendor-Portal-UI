import { Page } from '@playwright/test';
import { STATUS_DETAIL_LABELS as L } from '../item-master.constants';
import { fillTextField } from '../../../utils/field-accessor';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class ItemMasterStatusDetailSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async fillAll(data: { status?: string; statusRemarks?: string } = {}): Promise<void> {
    if (this.hasValue(data.status)) {
      await this.fields.selectDropdownByLabel(L.status, data.status);
    }
    if (this.hasValue(data.statusRemarks)) {
      await fillTextField(this.page, L.statusRemarks, data.statusRemarks);
    }
  }
}
