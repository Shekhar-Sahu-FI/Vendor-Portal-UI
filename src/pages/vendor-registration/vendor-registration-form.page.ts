import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { VendorRegistrationFillData } from '../../types/vendor-registration.types';
import { VENDOR_REGISTRATION_ROUTES, VENDOR_REGISTRATION_GENERAL_LABELS } from './vendor-registration.constants';
import { fillTextField, selectOption, getInputsByLabel } from '../../utils/field-accessor';
import { selectFromAutoSuggestion } from '../../utils/auto-suggestion.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { vendorRegistrationExpectSuccessToast } from './vendor-registration.assert.messages';

export class VendorRegistrationFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, VENDOR_REGISTRATION_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(VENDOR_REGISTRATION_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: VendorRegistrationFillData = {}): Promise<void> {
    // Step 1: General Details
    if (data.vendorName !== undefined) {
      await fillTextField(this.page, VENDOR_REGISTRATION_GENERAL_LABELS.vendorName, data.vendorName);
    }

    if (data.legalName !== undefined) {
      await fillTextField(this.page, VENDOR_REGISTRATION_GENERAL_LABELS.legalName, data.legalName);
    }

    if (data.address1 !== undefined) {
      await fillTextField(this.page, VENDOR_REGISTRATION_GENERAL_LABELS.address1, data.address1);
    }

    if (data.country) {
      const countryInput = getInputsByLabel(this.page, VENDOR_REGISTRATION_GENERAL_LABELS.country);
      await selectFromAutoSuggestion(this.page, countryInput, data.country.query, data.country.value);
    }

    if (data.state) {
      const stateInput = getInputsByLabel(this.page, VENDOR_REGISTRATION_GENERAL_LABELS.state);
      await selectFromAutoSuggestion(this.page, stateInput, data.state.query, data.state.value);
    }

    if (data.city) {
      const cityInput = getInputsByLabel(this.page, VENDOR_REGISTRATION_GENERAL_LABELS.city);
      await selectFromAutoSuggestion(this.page, cityInput, data.city.query, data.city.value);
    }

    if (data.pincode !== undefined) {
      await fillTextField(this.page, VENDOR_REGISTRATION_GENERAL_LABELS.pincode, data.pincode);
    }

    if (data.email !== undefined) {
      await fillTextField(this.page, VENDOR_REGISTRATION_GENERAL_LABELS.email, data.email);
    }
  }

  async clickContinue(): Promise<void> {
    const continueBtn = this.page.getByRole('button', { name: /^Continue$/i });
    if (await continueBtn.isVisible()) {
      await continueBtn.click();
    }
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        const submitBtn = this.page.getByRole('button', { name: /^Submit|^Save/i }).first();
        await submitBtn.click();
        await this.acceptSaveConfirmation().catch(() => {});
      },
      /\/api\/master\/vendor-registrations|\/api\/master\/vendor/i,
    );

    await this.expectSuccessToast('save');
    return (data?.vendorName as string) || (data?.publicId as string) || '';
  }

  async updateVendorName(newName: string): Promise<void> {
    await fillTextField(this.page, VENDOR_REGISTRATION_GENERAL_LABELS.vendorName, newName);
    const saveBtn = this.page.getByRole('button', { name: /^Save Changes|^Save/i }).first();
    await saveBtn.click();
    await this.acceptSaveConfirmation().catch(() => {});
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
    const toast = this.page.locator('.z-toast').filter({ hasText: /successfully|saved|registered|deleted|updated/i });
    await expect(toast.first(), vendorRegistrationExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
