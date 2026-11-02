import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { StateFillData } from '../../types/state-master.types';
import { STATE_MASTER_ROUTES, STATE_GENERAL_LABELS } from './state-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { stateExpectSuccessToast } from './state-master.assert.messages';

export class StateMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, STATE_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(STATE_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(STATE_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: StateFillData = {}): Promise<void> {
    if (data.stateName !== undefined) {
      await fillTextField(this.page, STATE_GENERAL_LABELS.stateName, data.stateName);
    }

    if (data.country) {
      // UCCombo country selection
      const comboInput = this.page.locator('input[placeholder="Search..."], .uc-combo input').first();
      if (await comboInput.isVisible().catch(() => false)) {
        await comboInput.fill(data.country);
        const option = this.page.locator('.uc-combo-option, li').filter({ hasText: data.country }).first();
        if (await option.isVisible().catch(() => false)) {
          await option.click();
        }
      }
    }

    if (data.gstStateCode !== undefined) {
      await fillTextField(this.page, STATE_GENERAL_LABELS.gstStateCode, data.gstStateCode);
    }

    if (data.isUnionTerritory !== undefined) {
      const checkbox = this.page.locator('input[type="checkbox"]#isUnionTerritory');
      if (await checkbox.isVisible().catch(() => false)) {
        if (data.isUnionTerritory) await checkbox.check();
        else await checkbox.uncheck();
      }
    }

    if (data.status) {
      await selectOption(this.page, STATE_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, STATE_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, STATE_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/states/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.stateName as string) || '';
  }

  async updateStateName(newName: string): Promise<void> {
    await fillTextField(this.page, STATE_GENERAL_LABELS.stateName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/states/i,
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
    await expect(toast.first(), stateExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
