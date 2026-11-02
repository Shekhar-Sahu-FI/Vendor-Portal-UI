import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { ItemMasterFillData } from '../../types/item-master.types';
import { ITEM_MASTER_ROUTES, GENERAL_DETAIL_LABELS } from './item-master.constants';
import { ItemMasterGeneralDetailSection } from './sections/item-master-general-detail.section';
import { ItemMasterMakeDetailSection } from './sections/item-master-make-detail.section';
import { ItemMasterUnitConversionDetailSection } from './sections/item-master-unit-conversion-detail.section';
import { ItemMasterStatusDetailSection } from './sections/item-master-status-detail.section';
import { getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { imExpectField, imExpectSuccessToast } from './item-master.assert.messages';

export class ItemMasterFormPage extends FormLayoutPage {
  readonly generalDetail: ItemMasterGeneralDetailSection;
  readonly makeDetail: ItemMasterMakeDetailSection;
  readonly unitConversionDetail: ItemMasterUnitConversionDetailSection;
  readonly statusDetail: ItemMasterStatusDetailSection;

  constructor(page: Page) {
    super(page, ITEM_MASTER_ROUTES.new());
    this.generalDetail = new ItemMasterGeneralDetailSection(page);
    this.makeDetail = new ItemMasterMakeDetailSection(page);
    this.unitConversionDetail = new ItemMasterUnitConversionDetailSection(page);
    this.statusDetail = new ItemMasterStatusDetailSection(page);
  }

  async openNew(): Promise<void> {
    await this.page.goto(ITEM_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(ITEM_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: ItemMasterFillData = {}): Promise<void> {
    await this.generalDetail.fillAll({
      subgroup: data.subgroup,
      itemName: data.itemName,
      stockUnit: data.stockUnit,
      gstCategory: data.gstCategory,
      hsnSacCode: data.hsnSacCode,
      remarks: data.remarks,
    });

    await this.makeDetail.fillAll({
      makeMgmtType: data.makeMgmtType,
      makeRows: data.makeRows,
    });

    await this.unitConversionDetail.fillAll({
      isMultipleUnitApplicable: data.isMultipleUnitApplicable,
      unitConversionRows: data.unitConversionRows,
    });

    await this.statusDetail.fillAll({
      status: data.status,
      statusRemarks: data.statusRemarks,
    });
  }

  async readItemCode(): Promise<string> {
    return getFieldValue(this.page, GENERAL_DETAIL_LABELS.itemCode);
  }

  async saveAndConfirm(): Promise<string> {
    const itemCode = (await this.readItemCode()).trim();
    if (!itemCode) {
      throw new Error(imExpectField(GENERAL_DETAIL_LABELS.itemCode, 'a non-empty value before save'));
    }

    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/items/i,
    );

    await this.expectImSuccessToast('save', /created|updated|saved|successfully/i);
    return itemCode;
  }

  async updateItemName(newName: string): Promise<void> {
    await this.generalDetail.fillAll({ itemName: newName });
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/items/i,
    );
    await this.expectImSuccessToast('update', /created|updated|saved|successfully/i);
  }

  async deleteCurrent(deleteReason?: string): Promise<void> {
    await this.openActionsMenu();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
    if (deleteReason) {
      await this.dialog.confirmDeleteWithReason(deleteReason);
    } else {
      await this.dialog.confirmDelete();
    }
    await this.expectImSuccessToast('delete', /deleted|successfully/i);
  }

  private async expectImSuccessToast(action: 'save' | 'update' | 'delete', pattern: RegExp): Promise<void> {
    const toast = this.page.locator('.z-toast').filter({ hasText: pattern });
    await expect(toast.first(), imExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
