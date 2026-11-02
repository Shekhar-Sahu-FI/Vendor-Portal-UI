import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { BusinessTypeMasterFormData } from '../../types/business-type-master.types';
import { BUSINESS_TYPE_MASTER_ROUTES, BUSINESS_TYPE_GENERAL_LABELS } from './business-type-master.constants';

export class BusinessTypeMasterFormPage extends BasePage {
  readonly codeInput: Locator;
  readonly businessTypeNameInput: Locator;
  readonly statusDropdown: Locator;
  readonly statusRemarksInput: Locator;

  constructor(page: Page) {
    super(page, BUSINESS_TYPE_MASTER_ROUTES.new());
    this.codeInput = this.form.getFieldInput(BUSINESS_TYPE_GENERAL_LABELS.code);
    this.businessTypeNameInput = this.form.getFieldInput(BUSINESS_TYPE_GENERAL_LABELS.businessTypeName);
    this.statusDropdown = this.form.getDropdown(BUSINESS_TYPE_GENERAL_LABELS.status);
    this.statusRemarksInput = this.form.getFieldInput(BUSINESS_TYPE_GENERAL_LABELS.statusRemarks);
  }

  async open(): Promise<void> {
    await this.page.goto(BUSINESS_TYPE_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: BusinessTypeMasterFormData): Promise<void> {
    if (data.businessTypeName !== undefined) {
      await this.form.fillField(BUSINESS_TYPE_GENERAL_LABELS.businessTypeName, data.businessTypeName);
    }
    if (data.status !== undefined) {
      await this.form.selectDropdown(BUSINESS_TYPE_GENERAL_LABELS.status, data.status);
    }
    if (data.statusRemarks !== undefined) {
      await this.form.fillField(BUSINESS_TYPE_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async updateBusinessTypeName(newName: string): Promise<void> {
    await this.form.fillField(BUSINESS_TYPE_GENERAL_LABELS.businessTypeName, newName);
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
