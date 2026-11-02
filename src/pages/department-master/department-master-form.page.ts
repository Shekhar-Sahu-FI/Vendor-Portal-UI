import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { DepartmentFillData } from '../../types/department-master.types';
import { DEPARTMENT_MASTER_ROUTES, DEPARTMENT_GENERAL_LABELS } from './department-master.constants';
import { fillTextField, selectOption, getFieldValue } from '../../utils/field-accessor';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { departmentExpectSuccessToast } from './department-master.assert.messages';

export class DepartmentMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, DEPARTMENT_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(DEPARTMENT_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async openEdit(id: number | string): Promise<void> {
    await this.page.goto(DEPARTMENT_MASTER_ROUTES.edit(id));
    await this.waitForAppReady();
  }

  async fill(data: DepartmentFillData = {}): Promise<void> {
    if (data.code !== undefined) {
      await fillTextField(this.page, DEPARTMENT_GENERAL_LABELS.code, data.code);
    }

    if (data.departmentName !== undefined) {
      await fillTextField(this.page, DEPARTMENT_GENERAL_LABELS.departmentName, data.departmentName);
    }

    if (data.companyDivisionIds && data.companyDivisionIds.length > 0) {
      // Select first row checkbox or matching rows
      const checkboxes = this.page.locator('tbody tr input[type="checkbox"]');
      const count = await checkboxes.count();
      for (let i = 0; i < Math.min(count, data.companyDivisionIds.length); i++) {
        await checkboxes.nth(i).check().catch(() => {});
      }
    } else {
      // Auto-select first company/division row if available and none selected
      const firstCheckbox = this.page.locator('tbody tr input[type="checkbox"]').first();
      if (await firstCheckbox.isVisible().catch(() => false)) {
        await firstCheckbox.check().catch(() => {});
      }
    }

    if (data.status) {
      await selectOption(this.page, DEPARTMENT_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, DEPARTMENT_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async readCode(): Promise<string> {
    return getFieldValue(this.page, DEPARTMENT_GENERAL_LABELS.code);
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/departments/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.departmentName as string) || '';
  }

  async updateDepartmentName(newName: string): Promise<void> {
    await fillTextField(this.page, DEPARTMENT_GENERAL_LABELS.departmentName, newName);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/departments/i,
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
    await expect(toast.first(), departmentExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
