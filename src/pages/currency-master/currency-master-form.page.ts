import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { CurrencyFillData } from '../../types/currency-master.types';
import { CURRENCY_MASTER_ROUTES, CURRENCY_GENERAL_LABELS } from './currency-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { currencyExpectSuccessToast } from './currency-master.assert.messages';

export class CurrencyMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, CURRENCY_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(CURRENCY_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(CURRENCY_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: CurrencyFillData = {}): Promise<void> {
    if (data.currencyName !== undefined) {
      await fillTextField(this.page, CURRENCY_GENERAL_LABELS.currencyName, data.currencyName);
    }

    if (data.currencyNotation !== undefined) {
      await fillTextField(this.page, CURRENCY_GENERAL_LABELS.currencyNotation, data.currencyNotation);
    }

    if (data.currencySymbol !== undefined) {
      await fillTextField(this.page, CURRENCY_GENERAL_LABELS.currencySymbol, data.currencySymbol);
    }

    if (data.subunitName !== undefined) {
      await fillTextField(this.page, CURRENCY_GENERAL_LABELS.subunitName, data.subunitName);
    }

    if (data.status) {
      await selectOption(this.page, CURRENCY_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, CURRENCY_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, CURRENCY_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/currencies/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.currencyName as string) || '';
  }

  async updateCurrencyName(newName: string): Promise<void> {
    await fillTextField(this.page, CURRENCY_GENERAL_LABELS.currencyName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/currencies/i,
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
    await expect(toast.first(), currencyExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
