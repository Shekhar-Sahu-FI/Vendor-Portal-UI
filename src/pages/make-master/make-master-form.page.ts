import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { MakeMasterFormData } from '../../types/make-master.types';
import { MAKE_MASTER_ROUTES, MAKE_GENERAL_LABELS } from './make-master.constants';

export class MakeMasterFormPage extends BasePage {
  readonly codeInput: Locator;
  readonly makeNameInput: Locator;
  readonly aliasInput: Locator;
  readonly statusDropdown: Locator;
  readonly statusRemarksInput: Locator;

  constructor(page: Page) {
    super(page, MAKE_MASTER_ROUTES.new());
    this.codeInput = this.form.getFieldInput(MAKE_GENERAL_LABELS.code);
    this.makeNameInput = this.form.getFieldInput(MAKE_GENERAL_LABELS.makeName);
    this.aliasInput = this.form.getFieldInput(MAKE_GENERAL_LABELS.alias);
    this.statusDropdown = this.form.getDropdown(MAKE_GENERAL_LABELS.status);
    this.statusRemarksInput = this.form.getFieldInput(MAKE_GENERAL_LABELS.statusRemarks);
  }

  async open(): Promise<void> {
    await this.page.goto(MAKE_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: MakeMasterFormData): Promise<void> {
    if (data.makeName !== undefined) {
      await this.form.fillField(MAKE_GENERAL_LABELS.makeName, data.makeName);
    }
    if (data.alias !== undefined) {
      await this.form.fillField(MAKE_GENERAL_LABELS.alias, data.alias);
    }
    if (data.status !== undefined) {
      await this.form.selectDropdown(MAKE_GENERAL_LABELS.status, data.status);
    }
    if (data.statusRemarks !== undefined) {
      await this.form.fillField(MAKE_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async updateMakeName(newName: string): Promise<void> {
    await this.form.fillField(MAKE_GENERAL_LABELS.makeName, newName);
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
