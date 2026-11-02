import { Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { PurchaseOrderFillData } from '../../types/purchase-order.types';
import {
  GENERAL_DETAIL_LABELS,
  PURCHASE_ORDER_REFERENCE_DOCUMENT_TYPE,
  PURCHASE_ORDER_ROUTES,
} from './purchase-order.constants';
import { PurchaseOrderDocumentDetailSection } from './sections/purchase-order-document-detail.section';
import { PurchaseOrderGeneralDetailSection } from './sections/purchase-order-general-detail.section';
import { PurchaseOrderItemDetailSection } from './sections/purchase-order-item-detail.section';
import { PurchaseOrderPrModalSection } from './sections/purchase-order-pr-modal.section';
import { PurchaseOrderShippingDetailSection } from './sections/purchase-order-shipping-detail.section';
import { PurchaseOrderCurrencyDetailSection } from './sections/purchase-order-currency-detail.section';
import { PurchaseOrderTermsConditionSection } from './sections/purchase-order-terms-condition.section';
import { fillTextField } from '../../utils/field-accessor';

export class PurchaseOrderFormPage extends FormLayoutPage {
  readonly documentDetail: PurchaseOrderDocumentDetailSection;
  readonly generalDetail: PurchaseOrderGeneralDetailSection;
  readonly itemDetail: PurchaseOrderItemDetailSection;
  readonly prModal: PurchaseOrderPrModalSection;
  readonly shippingDetail: PurchaseOrderShippingDetailSection;
  readonly currencyDetail: PurchaseOrderCurrencyDetailSection;
  readonly termsCondition: PurchaseOrderTermsConditionSection;

  constructor(page: Page) {
    super(page, PURCHASE_ORDER_ROUTES.new());
    this.documentDetail = new PurchaseOrderDocumentDetailSection(page);
    this.generalDetail = new PurchaseOrderGeneralDetailSection(page);
    this.itemDetail = new PurchaseOrderItemDetailSection(page);
    this.prModal = new PurchaseOrderPrModalSection(page);
    this.shippingDetail = new PurchaseOrderShippingDetailSection(page);
    this.currencyDetail = new PurchaseOrderCurrencyDetailSection(page);
    this.termsCondition = new PurchaseOrderTermsConditionSection(page);
  }

  async openNew() {
    await this.page.goto(PURCHASE_ORDER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string) {
    await this.page.goto(PURCHASE_ORDER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: PurchaseOrderFillData = {}): Promise<void> {
    await this.documentDetail.fillAll({
      company: data.company,
      division: data.division,
      documentType: data.documentType,
      documentDate: data.documentDate,
      documentNo: data.documentNo,
      documentStatus: data.documentStatus,
    });
    await this.generalDetail.fillAll({
      expenditureType: data.expenditureType,
      referenceDocumentType: data.referenceDocumentType,
      referenceDocumentTypeId: data.referenceDocumentTypeId,
      referenceDocumentNo: data.referenceDocumentNo,
      vendor: data.vendor,
      vendorLocation: data.vendorLocation,
      contactPerson: data.contactPerson,
      validityDate: data.validityDate,
      department: data.department,
      partyReferenceNo: data.partyReferenceNo,
      partyReferenceDate: data.partyReferenceDate,
      erpSerialNo: data.erpSerialNo,
      remarks: data.remarks,
    });

    if (data.prModalRows?.length) {
      await this.openSelectFromPrModal();
      await this.prModal.fillRows(data.prModalRows);
      await this.prModal.confirm();
    }

    if (data.itemRows?.length) {
      await this.itemDetail.fillAll(data.itemRows);
    }

   

    await this.shippingDetail.fillAll({
      vehicleType: data.vehicleType,
      paymentMode: data.paymentMode,
      dueBasis: data.dueBasis,
      dueDays: data.dueDays,
      freightType: data.freightType,
      freightRateType: data.freightRateType,
      freightAmount: data.freightAmount,
      priority: data.priority,
      fromLocation: data.fromLocation,
      toLocation: data.toLocation,
      consigneeLocation: data.consigneeLocation,
    });

    await this.currencyDetail.fillAll({
      currency: data.currency,
      exchangeRate: data.exchangeRate,
    });

    await this.termsCondition.fillAll({
      tncGroup: data.tncGroup,
      termsNConditionRows: data.termsNConditionRows,
    });
  }

  async selectReferenceTypePurchaseOrder(): Promise<void> {
    await this.generalDetail.fillReferenceDocumentTypeById(
      PURCHASE_ORDER_REFERENCE_DOCUMENT_TYPE.direct,
    );
  }

  async openSelectFromPrModal(): Promise<void> {
    await this.page.getByRole('button', { name: 'Select from PR', exact: true }).click();
    await this.prModal.waitForOpened();
  }

  async saveAndConfirm() {
    await this.clickSaveAndConfirm();
    await this.expectSuccessAfterSave(/created|updated|saved|successfully/i);
  }

  async updateRemarks(remarks: string) {
    await fillTextField(this.page, GENERAL_DETAIL_LABELS.remarks, remarks);
    await this.clickSaveAndConfirm();
    await this.expectSuccessAfterSave(/updated|saved|successfully/i);
  }

  async deleteCurrent(deleteReason?: string) {
    await this.openActionsMenu();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
    if (deleteReason) {
      await this.dialog.confirmDeleteWithReason(deleteReason);
    } else {
      await this.dialog.confirmDelete();
    }
    await this.expectSuccessAfterSave(/deleted|successfully/i);
  }

  getDocumentIdFromUrl(): number | null {
    const match = this.page.url().match(/purchase-order\/(\d+)/);
    return match ? Number(match[1]) : null;
  }
}
