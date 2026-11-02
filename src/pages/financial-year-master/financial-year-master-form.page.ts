import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { FinancialYearFillData } from '../../types/financial-year-master.types';
import { FINANCIAL_YEAR_MASTER_ROUTES, FINANCIAL_YEAR_GENERAL_LABELS } from './financial-year-master.constants';

export class FinancialYearMasterFormPage extends BasePage {
  readonly codeInput: Locator;
  readonly finYearNameInput: Locator;
  readonly aliasInput: Locator;
  readonly shortAliasInput: Locator;
  readonly startDateInput: Locator;
  readonly endDateInput: Locator;
  readonly statusDropdown: Locator;
  readonly statusRemarksInput: Locator;

  constructor(page: Page) {
    super(page, FINANCIAL_YEAR_MASTER_ROUTES.new());
    this.codeInput = this.form.getFieldInput(FINANCIAL_YEAR_GENERAL_LABELS.code);
    this.finYearNameInput = this.form.getFieldInput(FINANCIAL_YEAR_GENERAL_LABELS.finYearName);
    this.aliasInput = this.form.getFieldInput(FINANCIAL_YEAR_GENERAL_LABELS.alias);
    this.shortAliasInput = this.form.getFieldInput(FINANCIAL_YEAR_GENERAL_LABELS.shortAlias);
    this.startDateInput = this.form.getFieldInput(FINANCIAL_YEAR_GENERAL_LABELS.startDate);
    this.endDateInput = this.form.getFieldInput(FINANCIAL_YEAR_GENERAL_LABELS.endDate);
    this.statusDropdown = this.form.getDropdown(FINANCIAL_YEAR_GENERAL_LABELS.status);
    this.statusRemarksInput = this.form.getFieldInput(FINANCIAL_YEAR_GENERAL_LABELS.statusRemarks);
  }

  async open(): Promise<void> {
    await this.page.goto(FINANCIAL_YEAR_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: FinancialYearFillData): Promise<void> {
    if (data.finYearName !== undefined) {
      await this.form.fillField(FINANCIAL_YEAR_GENERAL_LABELS.finYearName, data.finYearName);
    }
    if (data.alias !== undefined) {
      await this.form.fillField(FINANCIAL_YEAR_GENERAL_LABELS.alias, data.alias);
    }
    if (data.shortAlias !== undefined) {
      await this.form.fillField(FINANCIAL_YEAR_GENERAL_LABELS.shortAlias, data.shortAlias);
    }
    if (data.startDate !== undefined) {
      await this.form.fillField(FINANCIAL_YEAR_GENERAL_LABELS.startDate, data.startDate);
    }
    if (data.endDate !== undefined) {
      await this.form.fillField(FINANCIAL_YEAR_GENERAL_LABELS.endDate, data.endDate);
    }
    if (data.status !== undefined) {
      await this.form.selectDropdown(FINANCIAL_YEAR_GENERAL_LABELS.status, data.status);
    }
    if (data.statusRemarks !== undefined) {
      await this.form.fillField(FINANCIAL_YEAR_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async updateFinYearName(newName: string): Promise<void> {
    await this.form.fillField(FINANCIAL_YEAR_GENERAL_LABELS.finYearName, newName);
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
