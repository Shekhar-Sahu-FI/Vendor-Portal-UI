import { expect, Locator, Page } from '@playwright/test';
import { AutoSuggestField } from '../../../types/purchase-order.types';
import { TERMS_CONDITION_LABELS as L } from '../purchase-order.constants';
import { FormFieldHelper } from '../../../utils/form-field.helper';

type TermsRow = {
  termsNConditionHead?: AutoSuggestField;
  value?: string;
};

export class PurchaseOrderTermsConditionSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private card(): Locator {
    return this.page.locator('div').filter({ hasText: L.sectionTitle }).first();
  }

  private termsRows(): Locator {
    return this.page.locator('table tbody tr');
  }

  private async ensureRow(rowIndex: number): Promise<void> {
    while ((await this.termsRows().count()) <= rowIndex) {
      const addRowButton = this.page.getByRole('button', { name: L.addRow }).first();
      if (!(await addRowButton.count())) break;
      await addRowButton.click();
    }
  }

  async fillGroup(field?: AutoSuggestField): Promise<void> {
    if (!field) return;
    const groupLabels = [L.group, 'Terms And Conditions Group', 'TnC Group'];
    for (const label of groupLabels) {
      const labelLocator = this.page.locator(`label:has-text("${label}")`).first();
      if (await labelLocator.count()) {
        await this.fields.selectInputSuggestion(label, field.query, field.value);
        return;
      }
    }
  }

  async fillRow(rowIndex: number, row: TermsRow): Promise<void> {
    await this.ensureRow(rowIndex);
    const currentRow = this.termsRows().nth(rowIndex);
    await expect(currentRow).toBeVisible();

    if (row.termsNConditionHead) {
      const firstInput = currentRow.locator('input').first();
      await firstInput.click();
      await firstInput.fill('');
      await firstInput.type(row.termsNConditionHead.query, { delay: 50 });
      const option = this.page.getByRole('option').filter({ hasText: row.termsNConditionHead.value }).first();
      if (await option.count()) {
        await option.click();
      } else {
        await this.page.getByRole('option').first().click();
      }
    }

    if (row.value !== undefined) {
      const textArea = currentRow.locator('textarea').first();
      if (await textArea.count()) {
        await textArea.fill(row.value);
      } else {
        const input = currentRow.locator('input').nth(1);
        if (await input.count()) {
          await input.fill(row.value);
        }
      }
    }
  }

  async fillAll(data: { tncGroup?: AutoSuggestField; termsNConditionRows?: TermsRow[] } = {}): Promise<void> {
    await this.card().scrollIntoViewIfNeeded().catch(() => {});
    await this.fillGroup(data.tncGroup);
    if (data.termsNConditionRows?.length) {
      for (let i = 0; i < data.termsNConditionRows.length; i++) {
        await this.fillRow(i, data.termsNConditionRows[i]);
      }
    }
  }
}
