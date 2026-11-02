import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { TermsAndConditionsGroupFillData } from '../../types/terms-and-conditions-group-master.types';
import {
  TERMS_AND_CONDITIONS_GROUP_MASTER_ROUTES,
  TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS,
} from './terms-and-conditions-group-master.constants';

export class TermsAndConditionsGroupMasterFormPage extends BasePage {
  readonly codeInput: Locator;
  readonly tncGroupNameInput: Locator;
  readonly rfqDefaultCheckbox: Locator;
  readonly poDefaultCheckbox: Locator;
  readonly statusDropdown: Locator;
  readonly statusRemarksInput: Locator;

  constructor(page: Page) {
    super(page, TERMS_AND_CONDITIONS_GROUP_MASTER_ROUTES.new());
    this.codeInput = this.form.getFieldInput(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.code);
    this.tncGroupNameInput = this.form.getFieldInput(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.tncGroupName);
    this.rfqDefaultCheckbox = this.form.getCheckbox(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.isRfqDefault);
    this.poDefaultCheckbox = this.form.getCheckbox(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.isPoDefault);
    this.statusDropdown = this.form.getDropdown(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.status);
    this.statusRemarksInput = this.form.getFieldInput(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.statusRemarks);
  }

  async open(): Promise<void> {
    await this.page.goto(TERMS_AND_CONDITIONS_GROUP_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: TermsAndConditionsGroupFillData): Promise<void> {
    if (data.tncGroupName !== undefined) {
      await this.form.fillField(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.tncGroupName, data.tncGroupName);
    }
    if (data.isRfqDefault !== undefined) {
      await this.form.setCheckbox(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.isRfqDefault, data.isRfqDefault);
    }
    if (data.isPoDefault !== undefined) {
      await this.form.setCheckbox(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.isPoDefault, data.isPoDefault);
    }
    if (data.status !== undefined) {
      await this.form.selectDropdown(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.status, data.status);
    }
    if (data.statusRemarks !== undefined) {
      await this.form.fillField(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async updateTncGroupName(newName: string): Promise<void> {
    await this.form.fillField(TERMS_AND_CONDITIONS_GROUP_GENERAL_LABELS.tncGroupName, newName);
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
