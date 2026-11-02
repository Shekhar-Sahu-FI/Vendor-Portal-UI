import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/base.page';
import { VendorAttachmentFillData } from '../../types/vendor-attachment-master.types';
import {
  VENDOR_ATTACHMENT_MASTER_ROUTES,
  VENDOR_ATTACHMENT_GENERAL_LABELS,
} from './vendor-attachment-master.constants';

export class VendorAttachmentMasterFormPage extends BasePage {
  readonly codeInput: Locator;
  readonly documentNameInput: Locator;
  readonly maxFileSizeInput: Locator;
  readonly isMandatoryDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly statusRemarksInput: Locator;

  constructor(page: Page) {
    super(page, VENDOR_ATTACHMENT_MASTER_ROUTES.new());
    this.codeInput = this.form.getFieldInput(VENDOR_ATTACHMENT_GENERAL_LABELS.code);
    this.documentNameInput = this.form.getFieldInput(VENDOR_ATTACHMENT_GENERAL_LABELS.documentName);
    this.maxFileSizeInput = this.form.getFieldInput(VENDOR_ATTACHMENT_GENERAL_LABELS.maxFileSize);
    this.isMandatoryDropdown = this.form.getDropdown(VENDOR_ATTACHMENT_GENERAL_LABELS.isMandatory);
    this.statusDropdown = this.form.getDropdown(VENDOR_ATTACHMENT_GENERAL_LABELS.status);
    this.statusRemarksInput = this.form.getFieldInput(VENDOR_ATTACHMENT_GENERAL_LABELS.statusRemarks);
  }

  async open(): Promise<void> {
    await this.page.goto(VENDOR_ATTACHMENT_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: VendorAttachmentFillData): Promise<void> {
    if (data.documentName !== undefined) {
      await this.form.fillField(VENDOR_ATTACHMENT_GENERAL_LABELS.documentName, data.documentName);
    }
    if (data.maxFileSize !== undefined) {
      await this.form.fillField(VENDOR_ATTACHMENT_GENERAL_LABELS.maxFileSize, String(data.maxFileSize));
    }
    if (data.isMandatory !== undefined) {
      const mandVal = typeof data.isMandatory === 'boolean' ? (data.isMandatory ? 'Yes' : 'No') : data.isMandatory;
      await this.form.selectDropdown(VENDOR_ATTACHMENT_GENERAL_LABELS.isMandatory, mandVal);
    }
    if (data.status !== undefined) {
      await this.form.selectDropdown(VENDOR_ATTACHMENT_GENERAL_LABELS.status, data.status);
    }
    if (data.statusRemarks !== undefined) {
      await this.form.fillField(VENDOR_ATTACHMENT_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async updateDocumentName(newName: string): Promise<void> {
    await this.form.fillField(VENDOR_ATTACHMENT_GENERAL_LABELS.documentName, newName);
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
