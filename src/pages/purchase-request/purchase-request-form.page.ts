import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { PurchaseRequestFillData } from '../../types/purchase-request.types';
import { ITEM_DETAIL_LABELS, PURCHASE_REQUEST_ROUTES } from './purchase-request.constants';
import { PurchaseRequestDocumentDetailSection } from './sections/purchase-request-document-detail.section';
import { PurchaseRequestGeneralDetailSection } from './sections/purchase-request-general-detail.section';
import { PurchaseRequestItemDetailSection } from './sections/purchase-request-item-detail.section';
import { PurchaseRequestInformToSection } from './sections/purchase-request-inform-to.section';
import { GENERAL_DETAIL_LABELS } from './purchase-request.constants';
import { fillTextField, getInputsByLabel } from '../../utils/field-accessor';
import { expectPurchaseRequestForm } from './purchase-request-form.expectations';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { prExpectField, prExpectSuccessToast } from './purchase-request.assert.messages';
import { DataCellTable } from '@utils/data-cell-table';
import { PR_ITEM_GRID_COLUMNS } from './grids/purchase-request-grid.columns';

export class PurchaseRequestFormPage extends FormLayoutPage {
  readonly documentDetail: PurchaseRequestDocumentDetailSection;
  readonly generalDetail: PurchaseRequestGeneralDetailSection;
  readonly itemDetail: PurchaseRequestItemDetailSection;
  readonly informTo: PurchaseRequestInformToSection;
  readonly table: DataCellTable<typeof PR_ITEM_GRID_COLUMNS>;

  constructor(page: Page) {
    super(page, PURCHASE_REQUEST_ROUTES.new());
    this.documentDetail = new PurchaseRequestDocumentDetailSection(page);
    this.generalDetail = new PurchaseRequestGeneralDetailSection(page);
    this.itemDetail = new PurchaseRequestItemDetailSection(page);
    this.informTo = new PurchaseRequestInformToSection(page);
    this.table = new DataCellTable(page, PR_ITEM_GRID_COLUMNS);
  }

  async openNew() {
    await this.page.goto(PURCHASE_REQUEST_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string) {
    await this.page.goto(PURCHASE_REQUEST_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  /**
   * Fills the full Purchase Request form from a flat data object.
   * Only fields present in `data` are filled.
   */
  async fill(data: PurchaseRequestFillData = {}): Promise<void> {
    await this.documentDetail.fillAll({
      company: data.company,
      division: data.division,
      documentType: data.documentType,
      documentDate: data.documentDate,
      documentNo: data.documentNo,
      documentStatus: data.documentStatus,
    });

    await this.generalDetail.fillAll({
      department: data.department,
      requestedBy: data.requestedBy,
      requestedByEmail: data.requestedByEmail,
      requestedContactNo: data.requestedContactNo,
      expenditureType: data.expenditureType,
      erpSerialNo: data.erpSerialNo,
      referenceNo: data.referenceNo,
      referenceDate: data.referenceDate,
      remarks: data.remarks,
    });

    if (data.itemRows?.length) {
      await this.itemDetail.fillAll(data.itemRows);
    }

    if (data.informToRows?.length) {
      await this.informTo.fillAll(data.informToRows);
    }
  }

  /** @alias fill */
  async fillAllSections(data: PurchaseRequestFillData = {}): Promise<void> {
    await this.fill(data);
  }

  async fillMinimumRequired(data: PurchaseRequestFillData = {}): Promise<void> {
    await this.fill(data);
    await this.documentDetail.ensureDocumentSeriesSelected();
    if (data.erpSerialNo) {
      await this.generalDetail.fields.selectErpSerialNo(data.erpSerialNo);
    }
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /purchase-request/i,
    );

    // If DocSavedAlert dialog appears (title contains "Saved"), click OK
    const docSavedDialog = this.page.locator('.z-alert-box').filter({ hasText: /Saved/i });
    if (await docSavedDialog.isVisible({ timeout: 5000 }).catch(() => false)) {
      const okButton = docSavedDialog.getByRole('button', { name: /^OK$/i });
      await okButton.click().catch(() => {});
      await docSavedDialog.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    } else {
      await this.expectPrSuccessToast('save', /created|updated|saved|successfully/i).catch(() => {});
    }

    const docNo = data?.docNoYearly as string | undefined;
    if (!docNo) {
      throw new Error(prExpectField('save response docNoYearly', 'a document number from API'));
    }

    // Ensure page returns to the list view after save
    if (this.page.url().includes('/new') || this.page.url().includes('/create')) {
      const cancelBtn = this.cancelButton();
      if (await cancelBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await cancelBtn.click().catch(() => {});
      } else {
        await this.page.goto(PURCHASE_REQUEST_ROUTES.list());
      }
    }

    return docNo;
  }

  async updateRemarks(remarks: string) {
    await fillTextField(this.page, GENERAL_DETAIL_LABELS.remarks, remarks);
    await this.clickSaveAndConfirm();
    await this.expectPrSuccessToast('update', /updated|saved|successfully/i);
  }

  async deleteCurrent(deleteReason?: string) {
    await this.openActionsMenu();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
    if (deleteReason) {
      await this.dialog.confirmDeleteWithReason(deleteReason);
    } else {
      await this.dialog.confirmDelete();
    }
    await this.expectPrSuccessToast('delete', /deleted|successfully/i);
  }

  private async expectPrSuccessToast(action: 'save' | 'update' | 'delete', pattern: RegExp): Promise<void> {
    const toast = this.page.locator('.z-toast').filter({ hasText: pattern });
    await expect(toast.first(), prExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }

  getDocumentIdFromUrl(): number | null {
    const match = this.page.url().match(/purchase-request\/(\d+)/);
    return match ? Number(match[1]) : null;
  }

  async expectSavedData(expected: PurchaseRequestFillData): Promise<void> {
    await expectPurchaseRequestForm(this.page, expected);
  }

  /** Clicks Save to trigger client-side validation without confirming save */
  async triggerSaveValidation(): Promise<void> {
    await this.clickSave();
    await this.page
      .locator('.text-destructive, .text-red-500, .z-alert-box')
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 })
      .catch(() => {});
  }

  async expectSaveBlocked(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(`${PURCHASE_REQUEST_ROUTES.new().replace(/\//g, '\\/')}$`));
  }

  async testField(): Promise<void> {
    // const remarksInput = await getInputsByLabel(this.page, GENERAL_DETAIL_LABELS.remarks)
    // remarksInput.fill('1234567890');
    // console.log("remarks input", await getInputsByLabel(this.page, GENERAL_DETAIL_LABELS.remarks).inputValue());

    // const maxLength = await remarksInput.getAttribute('maxlength');
    // const inputType = await remarksInput.getAttribute('type');
    // const step = await remarksInput.getAttribute('step');


    const qty = await this.table.input(0, 'prQty');
    // qty.fill('1234567890');
    // console.log("qty input", await getInputsByLabel(this.page, ITEM_DETAIL_LABELS.prQty).inputValue());

    this.itemDetail.fillRow(0, {
      item: { query: 'I-beams', value: 'I-beams' },
     // prQty: '1234567890'
    });
    
    //  await this.page.waitForTimeout(10000);
    
    const largeNumber = '123456789012345678901234567890';
    const decimalData = '.1234567890';   

    await qty.type(largeNumber, { delay: 50 });
    await qty.type(decimalData, { delay: 50 });
    const value = await qty.inputValue();

    console.log('Entered:', largeNumber.length);
    console.log('Accepted:', value.length);
    console.log('Value:', value);

    // await this.page.pause();

  }
}
