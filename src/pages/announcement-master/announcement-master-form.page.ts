import { expect, Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { AnnouncementFillData } from '../../types/announcement-master.types';
import { ANNOUNCEMENT_MASTER_ROUTES, ANNOUNCEMENT_GENERAL_LABELS } from './announcement-master.constants';
import { fillTextField, selectOption } from '../../utils/field-accessor';
import { fillDateByLabel } from '../../utils/date-calendar.helper';
import { captureSaveResponse } from '../../utils/save-response.helper';
import { announcementExpectSuccessToast } from './announcement-master.assert.messages';

export class AnnouncementMasterFormPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, ANNOUNCEMENT_MASTER_ROUTES.new());
  }

  async openNew(): Promise<void> {
    await this.page.goto(ANNOUNCEMENT_MASTER_ROUTES.new());
    await this.waitForAppReady();
  }

  async fill(data: AnnouncementFillData = {}): Promise<void> {
    if (data.type) {
      await selectOption(this.page, ANNOUNCEMENT_GENERAL_LABELS.type, data.type);
    }

    if (data.displayTo) {
      await selectOption(this.page, ANNOUNCEMENT_GENERAL_LABELS.displayTo, data.displayTo);
    }

    if (data.title !== undefined) {
      await fillTextField(this.page, ANNOUNCEMENT_GENERAL_LABELS.title, data.title);
    }

    if (data.description !== undefined) {
      await fillTextField(this.page, ANNOUNCEMENT_GENERAL_LABELS.description, data.description);
    }

    if (data.startDate) {
      await fillDateByLabel(this.page, ANNOUNCEMENT_GENERAL_LABELS.startDate, data.startDate);
    }

    if (data.endDate) {
      await fillDateByLabel(this.page, ANNOUNCEMENT_GENERAL_LABELS.endDate, data.endDate);
    }

    if (data.bannerSize) {
      await selectOption(this.page, ANNOUNCEMENT_GENERAL_LABELS.bannerSize, data.bannerSize);
    }

    if (data.status) {
      await selectOption(this.page, ANNOUNCEMENT_GENERAL_LABELS.status, data.status);
    }

    if (data.statusRemarks !== undefined) {
      await fillTextField(this.page, ANNOUNCEMENT_GENERAL_LABELS.statusRemarks, data.statusRemarks);
    }
  }

  async saveAndConfirm(): Promise<string> {
    const { data } = await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/announcement/i,
    );

    await this.expectSuccessToast('save');
    return (data?.code as string) || (data?.title as string) || '';
  }

  async updateTitle(newTitle: string): Promise<void> {
    await fillTextField(this.page, ANNOUNCEMENT_GENERAL_LABELS.title, newTitle);
    await captureSaveResponse(
      this.page,
      async () => {
        await this.clickSave();
        await this.acceptSaveConfirmation();
      },
      /\/api\/master\/announcement/i,
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
    await expect(toast.first(), announcementExpectSuccessToast(action)).toBeVisible({ timeout: 30_000 });
  }
}
