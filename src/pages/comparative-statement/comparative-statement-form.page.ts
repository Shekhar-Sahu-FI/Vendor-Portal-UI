import { Page, expect } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { COMPARATIVE_STATEMENT_ROUTES } from './comparative-statement.constants';
import { expectSaveNotConfirmed } from '../../utils/form-testing';

export class ComparativeStatementFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, COMPARATIVE_STATEMENT_ROUTES.list());
  }

  async openNew(role: string = 'company') {
    await this.page.goto(COMPARATIVE_STATEMENT_ROUTES.new(role));
    await this.waitForAppReady();
  }

  async openEdit(id: number | string, role: string = 'company') {
    await this.page.goto(COMPARATIVE_STATEMENT_ROUTES.edit(id, role));
    await this.waitForAppReady();
  }

  // Action Buttons
  saveBtn() {
    return this.page.getByRole('button', { name: /^Save$/i }).first();
  }

  cancelBtn() {
    return this.page.getByRole('button', { name: /^Cancel$/i }).first();
  }

  moreActionsBtn() {
    return this.page.locator('button[title="More Actions"], button[aria-label="More Actions"]').first();
  }

  deleteMenuItem() {
    return this.page.getByText('Delete', { exact: true }).first();
  }

  amendValidityDateMenuItem() {
    return this.page.getByText('Amend Validity Date', { exact: false }).first();
  }

  makeMappingMenuItem() {
    return this.page.getByText('Make Mapping', { exact: false }).first();
  }

  async triggerSaveValidation(): Promise<void> {
    await this.saveBtn().click();
    await this.page
      .locator('.text-destructive, .text-red-600, .text-red-500, .z-alert-box')
      .first()
      .waitFor({ state: 'visible', timeout: 5_000 })
      .catch(() => {});
  }

  async expectSaveBlockedByValidation(): Promise<void> {
    await expectSaveNotConfirmed(this.page);
  }

  // Header & CS Detail Inputs
  async selectDocType(typeText: string) {
    const select = this.page.locator('select[name="docTypeId"], #docTypeId select').first();
    if (await select.isVisible()) {
      await select.selectOption({ label: typeText });
    }
  }

  async fillCsDate(dateValue: string) {
    const input = this.page.locator('input[name="docDate"], #docDate input').first();
    if (await input.isVisible()) {
      await input.fill(dateValue);
      await input.blur();
    }
  }

  async fillCsNo(csNo: string) {
    const input = this.page.locator('input[name="docNoYearly"], #docNoYearly').first();
    if (await input.isVisible()) {
      await input.fill(csNo);
      await input.blur();
    }
  }

  // General Detail Inputs
  async selectRefDocType(refDocType: string) {
    const select = this.page.locator('select[name="refDocTypeId"], #refDocTypeId select').first();
    if (await select.isVisible()) {
      await select.selectOption({ label: refDocType });
    }
  }

  async fillRfqInput(rfqValue: string) {
    const input = this.page.locator('#rfqId, input[name="rfqId"]').first();
    if (await input.isVisible()) {
      await input.fill(rfqValue);
      await input.blur();
    }
  }

  async fillRefCsInput(csValue: string) {
    const input = this.page.locator('#refCsId, input[name="refCsId"]').first();
    if (await input.isVisible()) {
      await input.fill(csValue);
      await input.blur();
    }
  }

  async selectVendorSelectionBasis(basisLabel: string) {
    const select = this.page.locator('select[name="vendorSelectionBasisId"], #vendorSelectionBasisId select').first();
    if (await select.isVisible()) {
      await select.selectOption({ label: basisLabel });
    }
  }

  async fillValidityDate(dateValue: string) {
    const input = this.page.locator('input[name="validityDate"], #validityDate input').first();
    if (await input.isVisible()) {
      await input.fill(dateValue);
      await input.blur();
    }
  }

  async fillRemarks(remarks: string) {
    const textarea = this.page.locator('textarea[name="remarks"], #remarks').first();
    if (await textarea.isVisible()) {
      await textarea.fill(remarks);
    }
  }

  // Tabs Navigation
  async selectCsTab() {
    await this.page.getByRole('tab', { name: /CS/i }).click();
  }

  async selectNegotiationTab() {
    await this.page.getByRole('tab', { name: /Negotiation/i }).click();
  }

  // Validity Date Amendment Modal
  async openValidityDateAmendmentModal() {
    if (await this.moreActionsBtn().isVisible()) {
      await this.moreActionsBtn().click();
      await this.amendValidityDateMenuItem().click();
    }
  }

  async fillNewValidityDate(date: string) {
    const input = this.page.locator('input[name="newValidityDate"], [placeholder="New Validity Date"]').first();
    if (await input.isVisible()) {
      await input.fill(date);
      await input.blur();
    }
  }

  async fillAmendmentReason(reason: string) {
    const textarea = this.page.locator('textarea[name="reason"], [placeholder="Enter reason for change"]').first();
    if (await textarea.isVisible()) {
      await textarea.fill(reason);
      await textarea.blur();
    }
  }

  async submitValidityDateAmendment() {
    const btn = this.page.getByRole('button', { name: /Update Validity Date|Save|Update/i }).first();
    if (await btn.isVisible()) {
      await btn.click();
    }
  }

  // Vendor Selection Dialog (Item-Wise)
  async openItemVendorSelectionModal(rowIndex: number = 0) {
    const viewBtn = this.page.locator('button[title="Select Vendor"], button[aria-label="Select Vendor"]').nth(rowIndex);
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
    }
  }

  async confirmItemVendorModal() {
    const okBtn = this.page.getByRole('button', { name: /^Ok$/i }).first();
    if (await okBtn.isVisible()) {
      await okBtn.click();
    }
  }

  async closeItemVendorModal() {
    const cancelBtn = this.page.getByRole('button', { name: /^Cancel$/i }).first();
    if (await cancelBtn.isVisible()) {
      await cancelBtn.click();
    }
  }
}

