import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { CityFillData } from '../../types/city-master.types';
import { CITY_MASTER_ROUTES, CITY_GENERAL_LABELS } from './city-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { cityExpectSuccessToast } from './city-master.assert.messages';

export class CityMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, CITY_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(CITY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(CITY_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: CityFillData = {}): Promise<void> {
    if (data.cityName !== undefined) {
      await fillTextField(this.page, CITY_GENERAL_LABELS.cityName, data.cityName);
    }

    if (data.country) {
      const countryInput = this.page.locator('input[placeholder="Search..."], .uc-combo input').first();
      if (await countryInput.isVisible().catch(() => false)) {
        await countryInput.fill(data.country);
        const option = this.page.locator('.uc-combo-option, li').filter({ hasText: data.country }).first();
        if (await option.isVisible().catch(() => false)) {
          await option.click();
        }
      }
    }

    if (data.state) {
      const stateInput = this.page.locator('input[placeholder="Search..."], .uc-combo input').nth(1);
      if (await stateInput.isVisible().catch(() => false)) {
        await stateInput.fill(data.state);
        const option = this.page.locator('.uc-combo-option, li').filter({ hasText: data.state }).first();
        if (await option.isVisible().catch(() => false)) {
          await option.click();
        }
      }
    }

    if (data.status) {
      await selectOption(this.page, CITY_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, CITY_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, CITY_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/cities/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.cityName as string) || '';
  }

  async updateCityName(newName: string): Promise<void> {
    await fillTextField(this.page, CITY_GENERAL_LABELS.cityName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/cities/i,
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
    await expect(toast.first(), cityExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
