import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { CountryFillData } from '../../types/country-master.types';
import { COUNTRY_MASTER_ROUTES, COUNTRY_GENERAL_LABELS } from './country-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { countryExpectSuccessToast } from './country-master.assert.messages';

export class CountryMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, COUNTRY_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(COUNTRY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(COUNTRY_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: CountryFillData = {}): Promise<void> {
    if (data.countryName !== undefined) {
      await fillTextField(this.page, COUNTRY_GENERAL_LABELS.countryName, data.countryName);
    }

    if (data.isoCountryCode !== undefined) {
      await fillTextField(this.page, COUNTRY_GENERAL_LABELS.isoCountryCode, data.isoCountryCode);
    }

    if (data.phoneCode !== undefined) {
      await fillTextField(this.page, COUNTRY_GENERAL_LABELS.phoneCode, data.phoneCode);
    }

    if (data.pinCodeLength !== undefined) {
      await fillTextField(this.page, COUNTRY_GENERAL_LABELS.pinCodeLength, String(data.pinCodeLength));
    }

    if (data.pinCodeFormatId !== undefined) {
      await selectOption(this.page, COUNTRY_GENERAL_LABELS.pinCodeFormatId, String(data.pinCodeFormatId));
    }

    if (data.status) {
      await selectOption(this.page, COUNTRY_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, COUNTRY_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, COUNTRY_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/countries/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.countryName as string) || '';
  }

  async updateCountryName(newName: string): Promise<void> {
    await fillTextField(this.page, COUNTRY_GENERAL_LABELS.countryName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/countries/i,
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
    await expect(toast.first(), countryExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
