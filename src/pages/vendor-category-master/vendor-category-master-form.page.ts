import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { VendorCategoryMasterFormData } from '../../types/vendor-category-master.types';
import { VENDOR_CATEGORY_MASTER_ROUTES, VENDOR_CATEGORY_GENERAL_LABELS } from './vendor-category-master.constants';

export class VendorCategoryMasterFormPage extends BasePage {
  readonly codeInput: Locator;
  readonly vendorCategoryNameInput: Locator;
  readonly statusDropdown: Locator;
  readonly statusRemarksInput: Locator;

  constructor(page: Page) {
    super(page, VENDOR_CATEGORY_MASTER_ROUTES.new());
    this.codeInput = this.form.getFieldInput(VENDOR_CATEGORY_GENERAL_LABELS.code);
    this.vendorCategoryNameInput = this.form.getFieldInput(VENDOR_CATEGORY_GENERAL_LABELS.vendorCategoryName);
    this.statusDropdown = this.form.getDropdown(VENDOR_CATEGORY_GENERAL_LABELS.status);
    this.statusRemarksInput = this.form.getFieldInput(VENDOR_CATEGORY_GENERAL_LABELS.statusRemarks);
  }

  async open(): Promise<void> {
    await this.page.goto(VENDOR_CATEGORY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: VendorCategoryMasterFormData): Promise<void> {
    if (data.vendorCategoryName !== undefined) {
      await this.form.fillField(VENDOR_CATEGORY_GENERAL_LABELS.vendorCategoryName, data.vendorCategoryName);
    }
    if (data.status !== undefined) {
      await this.form.selectDropdown(VENDOR_CATEGORY_GENERAL_LABELS.status, data.status);
    }
    if (data.statusRemarks !== undefined) {
      await this.form.fillField(VENDOR_CATEGORY_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async updateVendorCategoryName(newName: string): Promise<void> {
    await this.form.fillField(VENDOR_CATEGORY_GENERAL_LABELS.vendorCategoryName, newName);
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
