import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { DivisionFillData } from '../../types/division-master.types';
import { DIVISION_MASTER_ROUTES, DIVISION_GENERAL_LABELS } from './division-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { divisionExpectSuccessToast } from './division-master.assert.messages';

export class DivisionMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, DIVISION_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(DIVISION_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(DIVISION_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: DivisionFillData = {}): Promise<void> {
    if (data.code !== undefined) {
      await fillTextField(this.page, DIVISION_GENERAL_LABELS.code, data.code);
    }

    if (data.divisionName !== undefined) {
      await fillTextField(this.page, DIVISION_GENERAL_LABELS.divisionName, data.divisionName);
    }

    // Company table selection
    const checkboxes = this.page.locator('tbody tr input[type="checkbox"]');
    const count = await checkboxes.count();
    if (data.companyIds && data.companyIds.length > 0) {
      for (let i = 0; i < Math.min(count, data.companyIds.length); i++) {
        await checkboxes.nth(i).check().catch(() => {});
      }
    } else {
      // Check first company if none explicitly passed
      const firstCheckbox = checkboxes.first();
      if (await firstCheckbox.isVisible().catch(() => false)) {
        await firstCheckbox.check().catch(() => {});
      }
    }

    if (data.status) {
      await selectOption(this.page, DIVISION_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, DIVISION_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, DIVISION_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/divisions/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.divisionName as string) || '';
  }

  async updateDivisionName(newName: string): Promise<void> {
    await fillTextField(this.page, DIVISION_GENERAL_LABELS.divisionName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/divisions/i,
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
    await expect(toast.first(), divisionExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
