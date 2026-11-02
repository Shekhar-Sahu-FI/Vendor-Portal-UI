import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { InformToGroupFillData } from '../../types/inform-to-group-master.types';
import { INFORM_TO_GROUP_MASTER_ROUTES, INFORM_TO_GROUP_GENERAL_LABELS } from './inform-to-group-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { selectFromAutoSuggestion } from '../../utils/auto-suggestion.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { informToGroupExpectSuccessToast } from './inform-to-group-master.assert.messages';

export class InformToGroupMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, INFORM_TO_GROUP_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(INFORM_TO_GROUP_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(INFORM_TO_GROUP_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: InformToGroupFillData = {}): Promise<void> {
    if (data.informToGroupName !== undefined) {
      await fillTextField(this.page, INFORM_TO_GROUP_GENERAL_LABELS.informToGroupName, data.informToGroupName);
    }

    if (data.description !== undefined) {
      await fillTextField(this.page, INFORM_TO_GROUP_GENERAL_LABELS.description, data.description);
    }

    if (data.users && data.users.length > 0) {
      for (let i = 0; i < data.users.length; i++) {
        const u = data.users[i];
        // If row doesn't exist, insert row
        const userCells = this.page.locator('[data-cell-id$="-userName"]');
        if ((await userCells.count()) <= i) {
          const addRowBtn = this.page.getByRole('button', { name: /Add Row|Insert Row/i }).first();
          if (await addRowBtn.isVisible().catch(() => false)) {
            await addRowBtn.click();
          }
        }
        const cell = userCells.nth(i);
        if (await cell.isVisible()) {
          await cell.click();
          const input = cell.locator('input').first();
          if (await input.isVisible().catch(() => false)) {
            await selectFromAutoSuggestion(this.page, input, u.userName.query, u.userName.value);
          }
        }
      }
    }

    if (data.status) {
      await selectOption(this.page, INFORM_TO_GROUP_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, INFORM_TO_GROUP_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/inform-to-group-master/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.informToGroupName as string) || '';
  }

  async updateDescription(newDesc: string): Promise<void> {
    await fillTextField(this.page, INFORM_TO_GROUP_GENERAL_LABELS.description, newDesc);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/inform-to-group-master/i,
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
    await expect(toast.first(), informToGroupExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
