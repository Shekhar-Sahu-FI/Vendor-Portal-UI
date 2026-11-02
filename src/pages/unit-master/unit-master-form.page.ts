import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { UnitMasterFormData } from '../../types/unit-master.types';
import { UNIT_MASTER_ROUTES, UNIT_GENERAL_LABELS } from './unit-master.constants';

export class UnitMasterFormPage extends BasePage {
  readonly codeInput: Locator;
  readonly unitNameInput: Locator;
  readonly aliasInput: Locator;
  readonly statusDropdown: Locator;
  readonly statusRemarksInput: Locator;

  constructor(page: Page) {
    super(page, UNIT_MASTER_ROUTES.new());
    this.codeInput = this.form.getFieldInput(UNIT_GENERAL_LABELS.code);
    this.unitNameInput = this.form.getFieldInput(UNIT_GENERAL_LABELS.unitName);
    this.aliasInput = this.form.getFieldInput(UNIT_GENERAL_LABELS.alias);
    this.statusDropdown = this.form.getDropdown(UNIT_GENERAL_LABELS.status);
    this.statusRemarksInput = this.form.getFieldInput(UNIT_GENERAL_LABELS.statusRemarks);
  }

  async open(): Promise<void> {
    await this.page.goto(UNIT_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: UnitMasterFormData): Promise<void> {
    if (data.unitName !== undefined) {
      await this.form.fillField(UNIT_GENERAL_LABELS.unitName, data.unitName);
    }
    if (data.alias !== undefined) {
      await this.form.fillField(UNIT_GENERAL_LABELS.alias, data.alias);
    }
    if (data.status !== undefined) {
      await this.form.selectDropdown(UNIT_GENERAL_LABELS.status, data.status);
    }
    if (data.statusRemarks !== undefined) {
      await this.form.fillField(UNIT_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async updateUnitName(newName: string): Promise<void> {
    await this.form.fillField(UNIT_GENERAL_LABELS.unitName, newName);
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
