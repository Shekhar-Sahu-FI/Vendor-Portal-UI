import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { CompanyLocationFillData } from '../../types/company-location-master.types';
import { COMPANY_LOCATION_MASTER_ROUTES, COMPANY_LOCATION_GENERAL_LABELS } from './company-location-master.constants';
import { fillTextField, selectOption, getFieldValue, getInputsByLabel, checkCheckbox } from '../../utils/field-accessor';
import { selectFromAutoSuggestion } from '../../utils/auto-suggestion.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { companyLocationExpectSuccessToast } from './company-location-master.assert.messages';

export class CompanyLocationMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, COMPANY_LOCATION_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(COMPANY_LOCATION_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(COMPANY_LOCATION_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: CompanyLocationFillData = {}): Promise<void> {
    if (data.company) {
      const companyInput = getInputsByLabel(this.page, COMPANY_LOCATION_GENERAL_LABELS.company);
      await selectFromAutoSuggestion(this.page, companyInput, data.company.query, data.company.value);
    }

    if (data.address1 !== undefined) {
      await fillTextField(this.page, COMPANY_LOCATION_GENERAL_LABELS.address1, data.address1);
    }

    if (data.country) {
      const countryInput = getInputsByLabel(this.page, COMPANY_LOCATION_GENERAL_LABELS.country);
      await selectFromAutoSuggestion(this.page, countryInput, data.country.query, data.country.value);
    }

    if (data.state) {
      const stateInput = getInputsByLabel(this.page, COMPANY_LOCATION_GENERAL_LABELS.state);
      await selectFromAutoSuggestion(this.page, stateInput, data.state.query, data.state.value);
    }

    if (data.city) {
      const cityInput = getInputsByLabel(this.page, COMPANY_LOCATION_GENERAL_LABELS.city);
      await selectFromAutoSuggestion(this.page, cityInput, data.city.query, data.city.value);
    }

    if (data.pincode !== undefined) {
      await fillTextField(this.page, COMPANY_LOCATION_GENERAL_LABELS.pincode, data.pincode);
    }

    if (data.contactNo !== undefined) {
      await fillTextField(this.page, COMPANY_LOCATION_GENERAL_LABELS.contactNo, data.contactNo);
    }

    if (data.isDefault !== undefined) {
      const defaultCheckbox = this.page.locator('input[type="checkbox"]#isDefault');
      if (await defaultCheckbox.isVisible().catch(() => false)) {
        if (data.isDefault) await defaultCheckbox.check();
        else await defaultCheckbox.uncheck();
      }
    }

    if (data.status) {
      await selectOption(this.page, COMPANY_LOCATION_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, COMPANY_LOCATION_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, COMPANY_LOCATION_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/company\/locations/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.address1 as string) || '';
  }

  async updateAddress(newAddress: string): Promise<void> {
    await fillTextField(this.page, COMPANY_LOCATION_GENERAL_LABELS.address1, newAddress);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/company\/locations/i,
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
    await expect(toast.first(), companyLocationExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
