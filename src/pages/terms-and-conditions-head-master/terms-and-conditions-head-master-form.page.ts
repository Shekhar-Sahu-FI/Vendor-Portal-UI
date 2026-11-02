import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { TermsAndConditionsHeadFillData } from '../../types/terms-and-conditions-head-master.types';
import {
  TERMS_AND_CONDITIONS_HEAD_MASTER_ROUTES,
  TERMS_AND_CONDITIONS_HEAD_GENERAL_LABELS,
} from './terms-and-conditions-head-master.constants';

export class TermsAndConditionsHeadMasterFormPage extends BasePage {
  readonly codeInput: Locator;
  readonly tncHeadNameInput: Locator;
  readonly statusDropdown: Locator;
  readonly statusRemarksInput: Locator;

  constructor(page: Page) {
    super(page, TERMS_AND_CONDITIONS_HEAD_MASTER_ROUTES.new());
    this.codeInput = this.form.getFieldInput(TERMS_AND_CONDITIONS_HEAD_GENERAL_LABELS.code);
    this.tncHeadNameInput = this.form.getFieldInput(TERMS_AND_CONDITIONS_HEAD_GENERAL_LABELS.tncHeadName);
    this.statusDropdown = this.form.getDropdown(TERMS_AND_CONDITIONS_HEAD_GENERAL_LABELS.status);
    this.statusRemarksInput = this.form.getFieldInput(TERMS_AND_CONDITIONS_HEAD_GENERAL_LABELS.statusRemarks);
  }

  async open(): Promise<void> {
    await this.page.goto(TERMS_AND_CONDITIONS_HEAD_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: TermsAndConditionsHeadFillData): Promise<void> {
    if (data.tncHeadName !== undefined) {
      await this.form.fillField(TERMS_AND_CONDITIONS_HEAD_GENERAL_LABELS.tncHeadName, data.tncHeadName);
    }
    if (data.status !== undefined) {
      await this.form.selectDropdown(TERMS_AND_CONDITIONS_HEAD_GENERAL_LABELS.status, data.status);
    }
    if (data.statusRemarks !== undefined) {
      await this.form.fillField(TERMS_AND_CONDITIONS_HEAD_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async updateTncHeadName(newName: string): Promise<void> {
    await this.form.fillField(TERMS_AND_CONDITIONS_HEAD_GENERAL_LABELS.tncHeadName, newName);
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
