import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { VendorLocationFillData } from '../../types/vendor-location-master.types';
import { VENDOR_LOCATION_MASTER_ROUTES, VENDOR_LOCATION_GENERAL_LABELS } from './vendor-location-master.constants';
import { fillTextField, selectOption, getInputsByLabel } from '../../utils/field-accessor';
import { selectFromAutoSuggestion } from '../../utils/auto-suggestion.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { vendorLocationExpectSuccessToast } from './vendor-location-master.assert.messages';

export class VendorLocationMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, VENDOR_LOCATION_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(VENDOR_LOCATION_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(VENDOR_LOCATION_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: VendorLocationFillData = {}): Promise<void> {
    if (data.vendor) {
      const vendorInput = getInputsByLabel(this.page, VENDOR_LOCATION_GENERAL_LABELS.vendor);
      await selectFromAutoSuggestion(this.page, vendorInput, data.vendor.query, data.vendor.value);
    }

    if (data.locationName !== undefined) {
      await fillTextField(this.page, VENDOR_LOCATION_GENERAL_LABELS.locationName, data.locationName);
    }

    if (data.address1 !== undefined) {
      await fillTextField(this.page, VENDOR_LOCATION_GENERAL_LABELS.address1, data.address1);
    }

    if (data.country) {
      const countryInput = getInputsByLabel(this.page, VENDOR_LOCATION_GENERAL_LABELS.country);
      await selectFromAutoSuggestion(this.page, countryInput, data.country.query, data.country.value);
    }

    if (data.state) {
      const stateInput = getInputsByLabel(this.page, VENDOR_LOCATION_GENERAL_LABELS.state);
      await selectFromAutoSuggestion(this.page, stateInput, data.state.query, data.state.value);
    }

    if (data.city) {
      const cityInput = getInputsByLabel(this.page, VENDOR_LOCATION_GENERAL_LABELS.city);
      await selectFromAutoSuggestion(this.page, cityInput, data.city.query, data.city.value);
    }

    if (data.pincode !== undefined) {
      await fillTextField(this.page, VENDOR_LOCATION_GENERAL_LABELS.pincode, data.pincode);
    }

    if (data.contactNo !== undefined) {
      await fillTextField(this.page, VENDOR_LOCATION_GENERAL_LABELS.contactNo, data.contactNo);
    }

    if (data.status) {
      await selectOption(this.page, VENDOR_LOCATION_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, VENDOR_LOCATION_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/vendor-locations/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.locationName as string) || '';
  }

  async updateLocationName(newName: string): Promise<void> {
    await fillTextField(this.page, VENDOR_LOCATION_GENERAL_LABELS.locationName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/vendor-locations/i,
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
    await expect(toast.first(), vendorLocationExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
