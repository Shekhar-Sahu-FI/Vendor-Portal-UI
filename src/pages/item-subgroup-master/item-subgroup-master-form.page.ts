import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { ItemSubgroupFillData } from '../../types/item-subgroup-master.types';
import { ITEM_SUBGROUP_MASTER_ROUTES, ITEM_SUBGROUP_GENERAL_LABELS } from './item-subgroup-master.constants';
import { fillTextField, selectOption, getInputsByLabel, getFieldValue } from '../../utils/field-accessor';
import { selectFromAutoSuggestion } from '../../utils/auto-suggestion.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { itemSubgroupExpectSuccessToast } from './item-subgroup-master.assert.messages';

export class ItemSubgroupMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, ITEM_SUBGROUP_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(ITEM_SUBGROUP_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(ITEM_SUBGROUP_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: ItemSubgroupFillData = {}): Promise<void> {
    if (data.group) {
      const groupInput = getInputsByLabel(this.page, ITEM_SUBGROUP_GENERAL_LABELS.group);
      await selectFromAutoSuggestion(this.page, groupInput, data.group.query, data.group.value);
    }

    if (data.code !== undefined) {
      await fillTextField(this.page, ITEM_SUBGROUP_GENERAL_LABELS.code, data.code);
    }

    if (data.subgroupName !== undefined) {
      await fillTextField(this.page, ITEM_SUBGROUP_GENERAL_LABELS.subgroupName, data.subgroupName);
    }

    if (data.stockUnit) {
      const unitInput = getInputsByLabel(this.page, ITEM_SUBGROUP_GENERAL_LABELS.stockUnit);
      await selectFromAutoSuggestion(this.page, unitInput, data.stockUnit.query, data.stockUnit.value);
    }

    if (data.gstCategoryId !== undefined) {
      await selectOption(this.page, ITEM_SUBGROUP_GENERAL_LABELS.gstCategory, String(data.gstCategoryId));
    }

    if (data.hsnSacCode !== undefined) {
      await fillTextField(this.page, ITEM_SUBGROUP_GENERAL_LABELS.hsnSacCode, data.hsnSacCode);
    }

    if (data.status) {
      await selectOption(this.page, ITEM_SUBGROUP_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, ITEM_SUBGROUP_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readSubgroupCode(): Promise<string> {
    return getFieldValue(this.page, ITEM_SUBGROUP_GENERAL_LABELS.subgroupCode);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/subgroups/i,
    );

    await this.expectSuccessToast('save');
    return (data?.subgroupCode as string) || (data?.subgroupName as string) || '';
  }

  async updateSubgroupName(newName: string): Promise<void> {
    await fillTextField(this.page, ITEM_SUBGROUP_GENERAL_LABELS.subgroupName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/subgroups/i,
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
    await expect(toast.first(), itemSubgroupExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
