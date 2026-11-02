import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { PriorityFillData } from '../../types/priority-master.types';
import { PRIORITY_MASTER_ROUTES, PRIORITY_GENERAL_LABELS } from './priority-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { priorityExpectSuccessToast } from './priority-master.assert.messages';

export class PriorityMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, PRIORITY_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(PRIORITY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(PRIORITY_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: PriorityFillData = {}): Promise<void> {
    if (data.priorityName !== undefined) {
      await fillTextField(this.page, PRIORITY_GENERAL_LABELS.priorityName, data.priorityName);
    }

    if (data.status) {
      await selectOption(this.page, PRIORITY_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, PRIORITY_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, PRIORITY_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/priorities/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.priorityName as string) || '';
  }

  async updatePriorityName(newName: string): Promise<void> {
    await fillTextField(this.page, PRIORITY_GENERAL_LABELS.priorityName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/priorities/i,
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
    await expect(toast.first(), priorityExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
