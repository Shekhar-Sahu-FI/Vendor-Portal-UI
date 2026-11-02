import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { CostCenterFillData } from '../../types/cost-center-master.types';
import { COST_CENTER_MASTER_ROUTES, COST_CENTER_GENERAL_LABELS } from './cost-center-master.constants';
import { fillTextField, selectOption, getInputsByLabel, getFieldValue } from '../../utils/field-accessor';
import { selectFromAutoSuggestion } from '../../utils/auto-suggestion.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { costCenterExpectSuccessToast } from './cost-center-master.assert.messages';

export class CostCenterMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, COST_CENTER_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(COST_CENTER_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(COST_CENTER_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: CostCenterFillData = {}): Promise<void> {
    if (data.alias !== undefined) {
      await fillTextField(this.page, COST_CENTER_GENERAL_LABELS.alias, data.alias);
    }

    if (data.costCenterName !== undefined) {
      await fillTextField(this.page, COST_CENTER_GENERAL_LABELS.costCenterName, data.costCenterName);
    }

    if (data.parentCostCenter) {
      const parentInput = getInputsByLabel(this.page, COST_CENTER_GENERAL_LABELS.parentCostCenter);
      await selectFromAutoSuggestion(this.page, parentInput, data.parentCostCenter.query, data.parentCostCenter.value);
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
      await selectOption(this.page, COST_CENTER_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, COST_CENTER_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, COST_CENTER_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/cost-centers/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.costCenterName as string) || '';
  }

  async updateCostCenterName(newName: string): Promise<void> {
    await fillTextField(this.page, COST_CENTER_GENERAL_LABELS.costCenterName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/cost-centers/i,
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
    await expect(toast.first(), costCenterExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
