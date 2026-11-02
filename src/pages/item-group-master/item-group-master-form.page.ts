import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { ItemGroupFillData } from '../../types/item-group-master.types';
import { ITEM_GROUP_MASTER_ROUTES, ITEM_GROUP_GENERAL_LABELS } from './item-group-master.constants';
import { fillTextField, selectOption, getFieldValue, getInputsByLabel } from '../../utils/field-accessor';
import { selectFromAutoSuggestion } from '../../utils/auto-suggestion.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { itemGroupExpectSuccessToast } from './item-group-master.assert.messages';

export class ItemGroupMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, ITEM_GROUP_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(ITEM_GROUP_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(ITEM_GROUP_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: ItemGroupFillData = {}): Promise<void> {
    if (data.category) {
      const categoryInput = getInputsByLabel(this.page, ITEM_GROUP_GENERAL_LABELS.category);
      await selectFromAutoSuggestion(this.page, categoryInput, data.category.query, data.category.value);
    }

    if (data.code !== undefined) {
      await fillTextField(this.page, ITEM_GROUP_GENERAL_LABELS.code, data.code);
    }

    if (data.groupName !== undefined) {
      await fillTextField(this.page, ITEM_GROUP_GENERAL_LABELS.groupName, data.groupName);
    }

    if (data.status) {
      await selectOption(this.page, ITEM_GROUP_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, ITEM_GROUP_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readGroupCode(): Promise<string> {
    return getFieldValue(this.page, ITEM_GROUP_GENERAL_LABELS.groupCode);
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, ITEM_GROUP_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const code = (await this.readCode()).trim();

    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/groups/i,
    );

    await this.expectSuccessToast('save');
    return code;
  }

  async updateGroupName(newName: string): Promise<void> {
    await fillTextField(this.page, ITEM_GROUP_GENERAL_LABELS.groupName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/groups/i,
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
    await expect(toast.first(), itemGroupExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
