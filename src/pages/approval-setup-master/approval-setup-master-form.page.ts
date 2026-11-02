import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { ApprovalSetupFillData } from '../../types/approval-setup-master.types';
import { APPROVAL_SETUP_MASTER_ROUTES } from './approval-setup-master.constants';
import { ApprovalSetupGeneralDetailSection } from './sections/approval-setup-general-detail.section';
import { ApprovalSetupCompanyDetailSection } from './sections/approval-setup-company-detail.section';
import { ApprovalSetupDocTypeDetailSection } from './sections/approval-setup-doc-type-detail.section';
import { ApprovalSetupLevelDetailSection } from './sections/approval-setup-level-detail.section';
import { ApprovalSetupStatusDetailSection } from './sections/approval-setup-status-detail.section';
import { GENERAL_DETAIL_LABELS } from './approval-setup-master.constants';
import { fillTextField } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { asmExpectField, asmExpectSuccessToast } from './approval-setup-master.assert.messages';

export class ApprovalSetupMasterFormPage extends FormLayoutPage {
  readonly generalDetail: ApprovalSetupGeneralDetailSection;
  readonly companyDetail: ApprovalSetupCompanyDetailSection;
  readonly docTypeDetail: ApprovalSetupDocTypeDetailSection;
  readonly levelDetail: ApprovalSetupLevelDetailSection;
  readonly statusDetail: ApprovalSetupStatusDetailSection;

  constructor(page: Page) {
    super(page, APPROVAL_SETUP_MASTER_ROUTES.new());
    this.generalDetail = new ApprovalSetupGeneralDetailSection(page);
    this.companyDetail = new ApprovalSetupCompanyDetailSection(page);
    this.docTypeDetail = new ApprovalSetupDocTypeDetailSection(page);
    this.levelDetail = new ApprovalSetupLevelDetailSection(page);
    this.statusDetail = new ApprovalSetupStatusDetailSection(page);
  }

  async openNew(): Promise<void> {
    await this.page.goto(APPROVAL_SETUP_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(APPROVAL_SETUP_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: ApprovalSetupFillData = {}): Promise<void> {
    await this.generalDetail.fillAll({
      approvalSetupName: data.approvalSetupName,
      formName: data.formName,
      approvalScope: data.approvalScope,
      minNetAmount: data.minNetAmount,
      maxNetAmount: data.maxNetAmount,
      description: data.description,
      fromDate: data.fromDate,
      toDate: data.toDate,
    });

    if (data.companyRows?.length || data.formName) {
      await this.companyDetail.fillAll(data.companyRows);
    }

    if (data.docTypeRows?.length || data.formName) {
      await this.docTypeDetail.fillAll(data.docTypeRows);
    }

    if (data.levelRows?.length) {
      await this.levelDetail.fillAll(data.levelRows);
    }

    await this.statusDetail.fillAll({
      status: data.status,
      statusRemarks: data.statusRemarks,
    });
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /approval-setups/i,
    );

    await this.expectAsmSuccessToast('save', /created|updated|saved|successfully/i);
    const code = data?.code as string | undefined;
    if (!code) {
      throw new Error(asmExpectField('save response code', 'an approval setup code from API'));
    }
    return code;
  }

  async updateDescription(description: string): Promise<void> {
    await fillTextField(this.page, GENERAL_DETAIL_LABELS.description, description);
    await this.clickSave();
    await this.acceptSaveConfirmation();
    await this.expectAsmSuccessToast('update', /updated|saved|successfully/i);
  }

  async deleteCurrent(deleteReason?: string): Promise<void> {
    await this.openActionsMenu();
    await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
    if (deleteReason) {
      await this.dialog.confirmDeleteWithReason(deleteReason);
    } else {
      await this.dialog.confirmDelete();
    }
    await this.expectAsmSuccessToast('delete', /deleted|successfully/i);
  }

  private async expectAsmSuccessToast(action: 'save' | 'update' | 'delete', pattern: RegExp): Promise<void> {
    const toast = this.page.locator('.z-toast').filter({ hasText: pattern });
    await expect(toast.first(), asmExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
