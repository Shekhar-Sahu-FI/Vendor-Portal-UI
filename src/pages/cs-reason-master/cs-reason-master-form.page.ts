import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { CsReasonFillData } from '../../types/cs-reason-master.types';
import { CS_REASON_MASTER_ROUTES, CS_REASON_GENERAL_LABELS } from './cs-reason-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { csReasonExpectSuccessToast } from './cs-reason-master.assert.messages';

export class CsReasonMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, CS_REASON_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(CS_REASON_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(CS_REASON_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: CsReasonFillData = {}): Promise<void> {
    if (data.reasonName !== undefined) {
      await fillTextField(this.page, CS_REASON_GENERAL_LABELS.reasonName, data.reasonName);
    }

    if (data.status) {
      await selectOption(this.page, CS_REASON_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, CS_REASON_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, CS_REASON_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/cs-reasons/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.reasonName as string) || '';
  }

  async updateReasonName(newName: string): Promise<void> {
    await fillTextField(this.page, CS_REASON_GENERAL_LABELS.reasonName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/cs-reasons/i,
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
    await expect(toast.first(), csReasonExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
