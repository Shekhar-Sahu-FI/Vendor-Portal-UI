import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { RegionMasterFormData } from '../../types/region-master.types';
import { REGION_MASTER_ROUTES, REGION_GENERAL_LABELS } from './region-master.constants';

export class RegionMasterFormPage extends BasePage {
  readonly codeInput: Locator;
  readonly regionNameInput: Locator;
  readonly statusDropdown: Locator;
  readonly statusRemarksInput: Locator;

  constructor(page: Page) {
    super(page, REGION_MASTER_ROUTES.new());
    this.codeInput = this.form.getFieldInput(REGION_GENERAL_LABELS.code);
    this.regionNameInput = this.form.getFieldInput(REGION_GENERAL_LABELS.regionName);
    this.statusDropdown = this.form.getDropdown(REGION_GENERAL_LABELS.status);
    this.statusRemarksInput = this.form.getFieldInput(REGION_GENERAL_LABELS.statusRemarks);
  }

  async open(): Promise<void> {
    await this.page.goto(REGION_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: RegionMasterFormData): Promise<void> {
    if (data.regionName !== undefined) {
      await this.form.fillField(REGION_GENERAL_LABELS.regionName, data.regionName);
    }
    if (data.status !== undefined) {
      await this.form.selectDropdown(REGION_GENERAL_LABELS.status, data.status);
    }
    if (data.statusRemarks !== undefined) {
      await this.form.fillField(REGION_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async updateRegionName(newName: string): Promise<void> {
    await this.form.fillField(REGION_GENERAL_LABELS.regionName, newName);
  }

  async saveAndConfirm(): Promise<void> {
    await this.footer.save();
    await this.dialog.confirm();
    await this.waitForAppReady();
  }

  async deleteCurrent(): Promise<void> {
    await this.footer.delete();
    await this.dialog.confirm();
    await this.waitForAppReady();
  }
}
