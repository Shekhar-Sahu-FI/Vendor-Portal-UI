import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { LocationFillData } from '../../types/location-master.types';
import { LOCATION_MASTER_ROUTES, LOCATION_GENERAL_LABELS } from './location-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { locationExpectSuccessToast } from './location-master.assert.messages';

export class LocationMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, LOCATION_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(LOCATION_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(LOCATION_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: LocationFillData = {}): Promise<void> {
    if (data.locationName !== undefined) {
      await fillTextField(this.page, LOCATION_GENERAL_LABELS.locationName, data.locationName);
    }

    if (data.alias !== undefined) {
      await fillTextField(this.page, LOCATION_GENERAL_LABELS.alias, data.alias);
    }

    if (data.status) {
      await selectOption(this.page, LOCATION_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, LOCATION_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, LOCATION_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/locations/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.locationName as string) || '';
  }

  async updateLocationName(newName: string): Promise<void> {
    await fillTextField(this.page, LOCATION_GENERAL_LABELS.locationName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/locations/i,
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
    await expect(toast.first(), locationExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
