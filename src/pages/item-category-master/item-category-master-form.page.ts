import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { ItemCategoryFillData } from '../../types/item-category-master.types';
import { ITEM_CATEGORY_MASTER_ROUTES, ITEM_CATEGORY_GENERAL_LABELS } from './item-category-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { itemCategoryExpectSuccessToast } from './item-category-master.assert.messages';

export class ItemCategoryMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, ITEM_CATEGORY_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(ITEM_CATEGORY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(ITEM_CATEGORY_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: ItemCategoryFillData = {}): Promise<void> {
    if (data.code !== undefined) {
      await fillTextField(this.page, ITEM_CATEGORY_GENERAL_LABELS.code, data.code);
    }

    if (data.categoryName !== undefined) {
      await fillTextField(this.page, ITEM_CATEGORY_GENERAL_LABELS.categoryName, data.categoryName);
    }

    if (data.status) {
      await selectOption(this.page, ITEM_CATEGORY_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, ITEM_CATEGORY_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, ITEM_CATEGORY_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const code = (await this.readCode()).trim();

    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/categories/i,
    );

    await this.expectSuccessToast('save');
    return code;
  }

  async updateCategoryName(newName: string): Promise<void> {
    await fillTextField(this.page, ITEM_CATEGORY_GENERAL_LABELS.categoryName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/categories/i,
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
    await expect(toast.first(), itemCategoryExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
