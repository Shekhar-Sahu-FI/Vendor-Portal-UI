import { Page, expect } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { QUOTATION_ROUTES } from './quotation.constants';
import { expectSaveNotConfirmed } from '../../utils/form-testing';

export class QuotationFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, QUOTATION_ROUTES.list());
  }

  async openNew(publicId?: string, role: string = 'vendor') {
    await this.page.goto(QUOTATION_ROUTES.new(publicId, role));
    await this.waitForAppReady();
  }

  async openEdit(id: number | string, role: string = 'vendor') {
    await this.page.goto(QUOTATION_ROUTES.edit(id, role));
    await this.waitForAppReady();
  }

  // Action Buttons
  saveBtn() {
    return this.page.getByRole('button', { name: /^Save$/i }).first();
  }

  submitBtn() {
    return this.page.getByRole('button', { name: /^Submit$/i }).first();
  }

  declineBtn() {
    return this.page.getByRole('button', { name: /Decline/i }).first();
  }

  withdrawBtn() {
    return this.page.getByRole('button', { name: /Withdraw/i }).first();
  }

  addQuotationBtn() {
    return this.page.getByRole('button', { name: /Add Quotation/i }).first();
  }

  moreActionsBtn() {
    return this.page.locator('button[title="More Actions"]').first();
  }

  deleteMenuItem() {
    return this.page.getByText('Delete', { exact: true }).first();
  }

  async triggerSaveValidation(): Promise<void> {
    await this.saveBtn().click();
    await this.page
      .locator('.text-destructive, .text-red-600, .text-red-500, .z-alert-box')
      .first()
      .waitFor({ state: 'visible', timeout: 5_000 })
      .catch(() => {});
  }

  async triggerSubmitValidation(): Promise<void> {
    await this.submitBtn().click();
    await this.page
      .locator('.text-destructive, .text-red-600, .text-red-500, .z-alert-box')
      .first()
      .waitFor({ state: 'visible', timeout: 5_000 })
      .catch(() => {});
  }

  async expectSaveBlockedByValidation(): Promise<void> {
    await expectSaveNotConfirmed(this.page);
  }

  // Header / General Detail Inputs
  async fillQuotationNo(value: string) {
    const input = this.page.locator('#quotationNo, input[name="quotationNo"]');
    await input.fill(value);
    await input.blur();
  }

  async fillCreditDays(value: string) {
    const input = this.page.locator('#creditDays, input[name="creditDays"]');
    await input.fill(value);
    await input.blur();
  }

  async fillValidityDate(value: string) {
    const input = this.page.locator('#validityDate input, input[name="validityDate"]').first();
    if (await input.isVisible()) {
      await input.fill(value);
      await input.blur();
    }
  }

  async selectFreightType(optionText: string) {
    const select = this.page.locator('#freightType select, select[name="freightType"]').first();
    if (await select.isVisible()) {
      await select.selectOption({ label: optionText });
    }
  }

  async selectPaymentMode(optionText: string) {
    const select = this.page.locator('#paymentMode select, select[name="paymentMode"]').first();
    if (await select.isVisible()) {
      await select.selectOption({ label: optionText });
    }
  }

  async fillRemarks(remarks: string) {
    const textarea = this.page.locator('#remarks, textarea[name="remarks"]');
    if (await textarea.isVisible()) {
      await textarea.fill(remarks);
    }
  }

  // Items Section
  async toggleSelectAll(checked: boolean = true) {
    const checkbox = this.page.locator('thead input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      const isCurrentChecked = await checkbox.isChecked();
      if (isCurrentChecked !== checked) {
        await checkbox.click();
      }
    }
  }

  async toggleItemSelection(rowIndex: number, checked: boolean = true) {
    const checkbox = this.page.locator(`tbody tr:nth-child(${rowIndex * 2 + 1}) input[type="checkbox"]`).first();
    if (await checkbox.isVisible()) {
      const isCurrentChecked = await checkbox.isChecked();
      if (isCurrentChecked !== checked) {
        await checkbox.click();
      }
    }
  }

  async fillItemHsn(rowIndex: number, hsn: string) {
    const input = this.page.locator(`input#items\\[${rowIndex}\\]\\.hsnCode, input[id="items[${rowIndex}].hsnCode"]`);
    await input.fill(hsn);
    await input.blur();
  }

  async fillItemRate(rowIndex: number, rate: string) {
    const input = this.page.locator(`input#items\\[${rowIndex}\\]\\.rate, input[id="items[${rowIndex}].rate"]`);
    await input.fill(rate);
    await input.blur();
  }

  async fillItemDiscountPercent(rowIndex: number, disc: string) {
    const input = this.page.locator(`input#items\\[${rowIndex}\\]\\.discountPercent, input[id="items[${rowIndex}].discountPercent"]`);
    await input.fill(disc);
    await input.blur();
  }

  async fillItemDiscountAmount(rowIndex: number, amt: string) {
    const input = this.page.locator(`input#items\\[${rowIndex}\\]\\.discountAmount, input[id="items[${rowIndex}].discountAmount"]`);
    await input.fill(amt);
    await input.blur();
  }

  async fillItemDeliveryDays(rowIndex: number, days: string) {
    const input = this.page.locator(`input#items\\[${rowIndex}\\]\\.deliveryDays, input[id="items[${rowIndex}].deliveryDays"]`);
    await input.fill(days);
    await input.blur();
  }

  // Tabs Navigation
  async switchTab(tabName: 'General Detail' | 'Terms & Condition' | 'Attachment' | 'Inform To' | 'Negotiation') {
    await this.page.getByRole('tab', { name: new RegExp(tabName, 'i') }).click();
  }

  // T&C Section
  async copyAllTncs() {
    const copyAllBtn = this.page.getByRole('button', { name: /Copy All/i });
    if (await copyAllBtn.isVisible()) {
      await copyAllBtn.click();
    }
  }

  async copySingleTnc(rowIndex: number) {
    const copyBtn = this.page.locator(`tbody tr:nth-child(${rowIndex + 1}) button[title="Copy this row"]`);
    if (await copyBtn.isVisible()) {
      await copyBtn.click();
    }
  }

  // Inform To Section
  async addContactPerson() {
    const addBtn = this.page.getByRole('button', { name: /Add Contact Person/i });
    if (await addBtn.isVisible()) {
      await addBtn.click();
    }
  }
}
