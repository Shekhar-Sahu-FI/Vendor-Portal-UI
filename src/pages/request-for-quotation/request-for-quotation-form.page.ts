import { Page, expect } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { RequestForQuotationFillData } from '../../types/request-for-quotation.types';
import {
  ITEM_DETAIL_LABELS,
  REQUEST_FOR_QUOTATION_ROUTES,
  RFQ_SOURCE_DOCUMENT_TYPE,
} from './request-for-quotation.constants';
import { RequestForQuotationDocumentDetailSection } from './sections/request-for-quotation-document-detail.section';
import { RequestForQuotationGeneralDetailSection } from './sections/request-for-quotation-general-detail.section';
import { RequestForQuotationItemDetailSection } from './sections/request-for-quotation-item-detail.section';
import { RequestForQuotationVendorDetailSection } from './sections/request-for-quotation-vendor-detail.section';
import { RequestForQuotationPrModalSection } from './sections/request-for-quotation-pr-modal.section';
import { RequestForQuotationTermsConditionSection } from './sections/request-for-quotation-terms-condition.section';
import { RequestForQuotationMailSubjectSection } from './sections/request-for-quotation-mail-subject.section';
import { expectSaveNotConfirmed } from '../../utils/form-testing';
import {
  applyRfqPortalItemDefaults,
} from '../../utils/test-data/request-for-quotation.factory';
import {
  loadRfqPortalSettings,
  rfqPortalSettingsFromEnv,
  RfqPortalSettings,
} from '../../utils/portal-settings.helper';

export class RequestForQuotationFormPage extends FormLayoutPage {
  readonly documentDetail: RequestForQuotationDocumentDetailSection;
  readonly generalDetail: RequestForQuotationGeneralDetailSection;
  readonly itemDetail: RequestForQuotationItemDetailSection;
  readonly vendorDetail: RequestForQuotationVendorDetailSection;
  readonly prModal: RequestForQuotationPrModalSection;
  readonly termsCondition: RequestForQuotationTermsConditionSection;
  readonly mailSubject: RequestForQuotationMailSubjectSection;

  private portalSettings: RfqPortalSettings | null = null;

  constructor(page: Page) {
    super(page, REQUEST_FOR_QUOTATION_ROUTES.new());
    this.documentDetail = new RequestForQuotationDocumentDetailSection(page);
    this.generalDetail = new RequestForQuotationGeneralDetailSection(page);
    this.itemDetail = new RequestForQuotationItemDetailSection(page);
    this.vendorDetail = new RequestForQuotationVendorDetailSection(page);
    this.prModal = new RequestForQuotationPrModalSection(page);
    this.termsCondition = new RequestForQuotationTermsConditionSection(page);
    this.mailSubject = new RequestForQuotationMailSubjectSection(page);
  }

  async openNew() {
    await this.page.goto(REQUEST_FOR_QUOTATION_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string) {
    await this.page.goto(REQUEST_FOR_QUOTATION_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  getPortalSettings(): RfqPortalSettings {
    return this.portalSettings ?? rfqPortalSettingsFromEnv();
  }

  private async ensurePortalSettings(): Promise<RfqPortalSettings> {
    if (!this.portalSettings) {
      this.portalSettings =
        process.env.RFQ_PORTAL_FETCH_API === '1'
          ? await loadRfqPortalSettings(this.page)
          : rfqPortalSettingsFromEnv();
    }
    return this.portalSettings;
  }

  private isPurchaseRequestMode(data: RequestForQuotationFillData): boolean {
    if (data.sourceDocumentTypeId === RFQ_SOURCE_DOCUMENT_TYPE.purchaseRequest) return true;
    const label =
      typeof data.sourceDocumentType === 'string'
        ? data.sourceDocumentType
        : data.sourceDocumentType?.value;
    return /purchase\s*request/i.test(label ?? '');
  }

  private isDirectMode(data: RequestForQuotationFillData): boolean {
    if (data.sourceDocumentTypeId === RFQ_SOURCE_DOCUMENT_TYPE.direct) return true;
    const label =
      typeof data.sourceDocumentType === 'string'
        ? data.sourceDocumentType
        : data.sourceDocumentType?.value;
    return /direct/i.test(label ?? '');
  }

  async fillSourceDocumentDirect(): Promise<void> {
    await this.generalDetail.fillSourceDocumentTypeById(RFQ_SOURCE_DOCUMENT_TYPE.direct);
  }

  async fillSourceDocumentPurchaseRequest(): Promise<void> {
    await this.generalDetail.fillSourceDocumentTypeById(RFQ_SOURCE_DOCUMENT_TYPE.purchaseRequest);
  }

  async openSelectFromPrModal(): Promise<void> {
    await this.page.getByRole('button', { name: ITEM_DETAIL_LABELS.selectFromPr, exact: true }).click();
    await this.prModal.waitForOpened();
  }

  async fill(data: RequestForQuotationFillData = {}): Promise<void> {
    const portalSettings = await this.ensurePortalSettings();

    await this.documentDetail.fillAll({
      division: data.division,
      documentType: data.documentType,
      documentDate: data.documentDate,
      documentNo: data.documentNo,
      documentStatus: data.documentStatus,
    });

    await this.generalDetail.fillAll({
      sourceDocumentType: data.sourceDocumentType,
      sourceDocumentTypeId: data.sourceDocumentTypeId,
      dueDate: data.dueDate,
      isPriceList: this.isDirectMode(data) ? data.isPriceList : undefined,
      contactPersonName: data.contactPersonName,
      contactEmail: data.contactEmail,
      remarks: data.remarks,
    });

    if (this.isPurchaseRequestMode(data) && data.prModalRows?.length) {
      await this.openSelectFromPrModal();
      await this.prModal.fillRows(data.prModalRows);
      await this.prModal.confirm();
    }

    if (this.isDirectMode(data) && data.itemRows?.length) {
      const itemRows = applyRfqPortalItemDefaults(data.itemRows, portalSettings);
      await this.itemDetail.fillAll(itemRows, portalSettings);
    }

    if (data.vendorRows?.length) {
      await this.vendorDetail.fillAll(data.vendorRows, portalSettings);
    }

    if (!portalSettings.isDisableTncInRfq) {
      await this.termsCondition.fillAll({
        tncGroup: data.tncGroup,
        termsNConditionRows: data.termsNConditionRows,
      });
    }

    if (data.mailSubject) {
      await this.mailSubject.fillMailSubject(data.mailSubject);
    }
  }

  /** Clicks Save to run client-side validation without confirming the save dialog. */
  async triggerSaveValidation(): Promise<void> {
    await this.clickSave();
    await this.page.locator('.text-destructive, .text-red-500').first().waitFor({
      state: 'visible',
      timeout: 10_000,
    }).catch(() => {});
  }

  async expectSaveBlockedByValidation(): Promise<void> {
    await this.page.waitForURL(new RegExp(`${REQUEST_FOR_QUOTATION_ROUTES.new().replace(/\//g, '\\/')}$`));
    await expectSaveNotConfirmed(this.page);
  }

  async saveAndConfirm() {
    const saveRequest = this.page.waitForResponse(
      (response) =>
        /request-for-quotation/i.test(response.url())
        && ['POST', 'PUT'].includes(response.request().method())
        && response.ok(),
      { timeout: 90_000 },
    );

    await this.clickSave();
    await this.acceptSaveConfirmation();
    await saveRequest;
    await this.expectSuccessAfterSave(/created|updated|saved|successfully/i);
  }

  getDocumentIdFromUrl(): number | null {
    const match = this.page.url().match(/request-for-quotation\/(\d+)/);
    return match ? Number(match[1]) : null;
  }
}
