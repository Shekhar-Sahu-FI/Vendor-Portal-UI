import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { DocTypeFillData } from '../../types/doc-type-master.types';
import { DOC_TYPE_MASTER_ROUTES, DOC_TYPE_GENERAL_LABELS } from './doc-type-master.constants';
import { fillTextField, selectOption, getFieldValue, getInputsByLabel } from '../../utils/field-accessor';
import { selectFromAutoSuggestion } from '../../utils/auto-suggestion.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { docTypeExpectSuccessToast } from './doc-type-master.assert.messages';

export class DocTypeMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, DOC_TYPE_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(DOC_TYPE_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(DOC_TYPE_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: DocTypeFillData = {}): Promise<void> {
    if (data.docTypeName !== undefined) {
      await fillTextField(this.page, DOC_TYPE_GENERAL_LABELS.docTypeName, data.docTypeName);
    }

    if (data.docTypeAlias !== undefined) {
      await fillTextField(this.page, DOC_TYPE_GENERAL_LABELS.docTypeAlias, data.docTypeAlias);
    }

    if (data.form) {
      const formInput = getInputsByLabel(this.page, DOC_TYPE_GENERAL_LABELS.form);
      await selectFromAutoSuggestion(this.page, formInput, data.form.query, data.form.value);
    }

    // Company/Division selection in DataGrid
    const checkboxes = this.page.locator('tbody tr input[type="checkbox"]');
    const count = await checkboxes.count();
    if (data.companyDivisionIds && data.companyDivisionIds.length > 0) {
      for (let i = 0; i < Math.min(count, data.companyDivisionIds.length); i++) {
        await checkboxes.nth(i).check().catch(() => {});
      }
    } else {
      const firstCheckbox = checkboxes.first();
      if (await firstCheckbox.isVisible().catch(() => false)) {
        await firstCheckbox.check().catch(() => {});
      }
    }

    if (data.status) {
      await selectOption(this.page, DOC_TYPE_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, DOC_TYPE_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, DOC_TYPE_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/doc-types/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.docTypeName as string) || '';
  }

  async updateDocTypeName(newName: string): Promise<void> {
    await fillTextField(this.page, DOC_TYPE_GENERAL_LABELS.docTypeName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/doc-types/i,
    );
    await this.expectSuccessToast('update');
  }

  async deleteCurrent(deleteReason?: string): Promise<void> {
    await this.openActionsMenu();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
    if (deleteReason) {
      await this.dialog.confirmDeleteWithReason(deleteReason);
    } else {
      await this.dialog.confirmDelete();
    }
    await this.expectSuccessToast('delete');
  }

  private async expectSuccessToast(action: 'save' | 'update' | 'delete'): Promise<void> {
    const toast = this.page.locator('.z-toast').filter({ hasText: /successfully|saved|deleted|updated/i });
    await expect(toast.first(), docTypeExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
