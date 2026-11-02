import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { VendorMasterFillData } from '../../types/vendor-master.types';
import { VENDOR_MASTER_ROUTES, VENDOR_MASTER_GENERAL_LABELS } from './vendor-master.constants';
import { fillTextField, selectOption, getInputsByLabel } from '../../utils/field-accessor';
import { selectFromAutoSuggestion } from '../../utils/auto-suggestion.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { vendorMasterExpectSuccessToast } from './vendor-master.assert.messages';

export class VendorMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, VENDOR_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(VENDOR_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(VENDOR_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: VendorMasterFillData = {}): Promise<void> {
    if (data.vendorName !== undefined) {
      await fillTextField(this.page, VENDOR_MASTER_GENERAL_LABELS.vendorName, data.vendorName);
    }

    if (data.legalName !== undefined) {
      await fillTextField(this.page, VENDOR_MASTER_GENERAL_LABELS.legalName, data.legalName);
    }

    if (data.address1 !== undefined) {
      await fillTextField(this.page, VENDOR_MASTER_GENERAL_LABELS.address1, data.address1);
    }

    if (data.country) {
      const countryInput = getInputsByLabel(this.page, VENDOR_MASTER_GENERAL_LABELS.country);
      await selectFromAutoSuggestion(this.page, countryInput, data.country.query, data.country.value);
    }

    if (data.state) {
      const stateInput = getInputsByLabel(this.page, VENDOR_MASTER_GENERAL_LABELS.state);
      await selectFromAutoSuggestion(this.page, stateInput, data.state.query, data.state.value);
    }

    if (data.city) {
      const cityInput = getInputsByLabel(this.page, VENDOR_MASTER_GENERAL_LABELS.city);
      await selectFromAutoSuggestion(this.page, cityInput, data.city.query, data.city.value);
    }

    if (data.pincode !== undefined) {
      await fillTextField(this.page, VENDOR_MASTER_GENERAL_LABELS.pincode, data.pincode);
    }

    if (data.email !== undefined) {
      await fillTextField(this.page, VENDOR_MASTER_GENERAL_LABELS.email, data.email);
    }

    if (data.panNo !== undefined) {
      await fillTextField(this.page, VENDOR_MASTER_GENERAL_LABELS.panNo, data.panNo);
    }

    if (data.status) {
      await selectOption(this.page, VENDOR_MASTER_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, VENDOR_MASTER_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/vendor/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.vendorName as string) || '';
  }

  async updateVendorName(newName: string): Promise<void> {
    await fillTextField(this.page, VENDOR_MASTER_GENERAL_LABELS.vendorName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/vendor/i,
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
    await expect(toast.first(), vendorMasterExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
