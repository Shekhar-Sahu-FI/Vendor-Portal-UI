import { Page, expect } from '@playwright/test';
import { AutoSuggestField } from '../../../types/purchase-request.types';
import { DOCUMENT_DETAIL_LABELS as L } from '../purchase-request.constants';
import { selectOption, fillTextField } from '../../../utils/field-accessor';
import { fillDateByLabel } from '../../../utils/date-calendar.helper';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class PurchaseRequestDocumentDetailSection {
  readonly fields: FormFieldHelper;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async fillCompany(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.company, field.query, field.value);
  }

  async fillDivision(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.division, field.query, field.value);
  }

  async fillDocumentType(field: AutoSuggestField) {
    await this.fields.selectInputSuggestion(L.documentType, field.query, field.value);
  }

  async fillDocumentDate(value: string) {
    await fillDateByLabel(this.page, L.documentDate, value);
  }

  async fillDocumentNo(value: string) {
    await fillTextField(this.page, L.documentNo, value);
  }

  async fillDocumentStatus(statusLabel: string) {
    await selectOption(this.page, L.documentStatus, statusLabel);
  }

  /**
   * Ensures PR No. has a document series selected.
   * If empty after a brief wait for the async API fetch, opens the Document Series modal,
   * selects a series, and confirms with OK.
   */
  async ensureDocumentSeriesSelected(): Promise<void> {
    const input = this.page.locator('input[name="docNoYearly"]');

    // Wait briefly in case the async document series fetch auto-populates docNoYearly
    await expect(async () => {
      const v = (await input.inputValue().catch(() => ''))?.trim();
      expect(v).toBeTruthy();
    }).toPass({ timeout: 2_000 }).catch(() => {});

    const val = (await input.inputValue().catch(() => ''))?.trim();
    if (!val) {
      const gearBtn = this.page.locator('button[title="DocumentSerialButton"]').first();
      if (await gearBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await gearBtn.click();
        const dialog = this.page
          .locator('[role="dialog"], div.fixed')
          .filter({ hasText: 'Document Series' })
          .last();
        await expect(dialog).toBeVisible({ timeout: 5_000 });

        const okBtn = dialog.getByRole('button', { name: 'OK', exact: true });
        await okBtn.click();

        // If clicking OK didn't close it (meaning no series was selected by default), select row 0
        const isStillOpen = await dialog.isVisible({ timeout: 1_000 }).catch(() => false);
        if (isStillOpen) {
          const checkbox = dialog.locator('table tbody tr input[type="checkbox"]').first();
          if (await checkbox.isVisible({ timeout: 1_000 }).catch(() => false)) {
            await checkbox.click({ force: true });
            await okBtn.click();
          } else {
            const firstCell = dialog.locator('table tbody tr [data-cell-id*="isSelected"], table tbody tr td:nth-child(2)').first();
            if (await firstCell.isVisible({ timeout: 3_000 }).catch(() => false)) {
              await firstCell.click({ force: true });
              await okBtn.click();
            } else {
              const cancelBtn = dialog.getByRole('button', { name: 'Cancel', exact: true });
              await cancelBtn.click().catch(() => {});
            }
          }
        }

        await dialog.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => {});
      }
    }
  }

  async fillAll(data: {
    company?: AutoSuggestField;
    division?: AutoSuggestField;
    documentType?: AutoSuggestField;
    documentDate?: string;
    documentNo?: string;
    documentStatus?: string;
  } = {}): Promise<void> {
    if (data.company) await this.fillCompany(data.company);
    if (data.division) await this.fillDivision(data.division);
    if (data.documentType) await this.fillDocumentType(data.documentType);
    if (this.hasValue(data.documentDate)) await this.fillDocumentDate(data.documentDate);
    if (this.hasValue(data.documentNo)) await this.fillDocumentNo(data.documentNo);
    if (this.hasValue(data.documentStatus)) await this.fillDocumentStatus(data.documentStatus);
    await this.ensureDocumentSeriesSelected();
  }
}
