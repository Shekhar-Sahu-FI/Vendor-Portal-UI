import { Page, expect } from '@playwright/test';
import path from 'path';
import { RequestForQuotationItemRowData } from '../../../types/request-for-quotation.types';
import { DataCellTable } from '../../../utils/data-cell-table';
import {
  attachmentPanelInDialog,
  closeAttachmentDialog,
  uploadViaUploadButton,
  waitUntilUploaded,
} from '../../../utils/attachment.helper';
import { attachmentAsset } from '../../../utils/attachment-assets.helper';
import {
  RFQ_ITEM_ATTACHMENT_DIALOG_TITLE,
  RFQ_ITEM_GRID_COLUMNS,
  RFQ_ITEM_GRID_OVERLAY_PLACEHOLDERS,
} from '../grids/request-for-quotation-grid.columns';
import { RfqPortalSettings } from '../../../utils/portal-settings.helper';

export class RequestForQuotationItemDetailSection {
  private readonly table: DataCellTable<typeof RFQ_ITEM_GRID_COLUMNS>;

  constructor(private readonly page: Page) {
    this.table = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);
  }

  /** Paperclip in `cell-{row}-attachment` (title: "No attachments" or "N Attachment(s)"). */
  attachmentButton(rowIndex: number) {
    return this.table.cell(rowIndex, 'attachment').getByRole('button').first();
  }

  async openAttachmentDialog(rowIndex: number): Promise<void> {
    await this.table.scrollCellIntoView(rowIndex, 'attachment');
    await this.attachmentButton(rowIndex).click();
    await expect(this.page.getByText(RFQ_ITEM_ATTACHMENT_DIALOG_TITLE)).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Item grid → attachment dialog → Upload Files → wait for Uploaded/Completed.
   */
  async uploadAttachment(rowIndex: number, file = 'sample.pdf'): Promise<void> {
    await this.openAttachmentDialog(rowIndex);
    const panel = attachmentPanelInDialog(this.page, RFQ_ITEM_ATTACHMENT_DIALOG_TITLE);
    const filePath = attachmentAsset(file);
    const fileName = path.basename(file);

    await uploadViaUploadButton(panel, this.page, filePath);
    await waitUntilUploaded(panel, fileName);
    await closeAttachmentDialog(this.page, RFQ_ITEM_ATTACHMENT_DIALOG_TITLE);
  }

  async expectNoItemAttachments(rowIndex: number): Promise<void> {
    await expect(this.attachmentButton(rowIndex)).toHaveAttribute('title', 'No attachments');
  }

  async fillRow(
    rowIndex: number,
    row: RequestForQuotationItemRowData,
    portalSettings?: RfqPortalSettings,
  ): Promise<void> {
    if (row.item) {
      await this.table.selectSuggestion(rowIndex, 'itemName', row.item.query, row.item.value);
    }
    if (row.make) {
      await this.table.selectSuggestion(rowIndex, 'makeName', row.make.query, row.make.value);
    } else if (portalSettings?.isRfqItemMakeRequired) {
      throw new Error(`Make is required by portal settings for item row ${rowIndex + 1}`);
    }
    if (row.unit) {
      await this.table.selectSuggestion(rowIndex, 'unitCode', row.unit.query, row.unit.value);
    }
    if (row.techSpecification) {
      await this.table.fillTextareaOverlayCell(
        rowIndex,
        'techSpecification',
        row.techSpecification,
        RFQ_ITEM_GRID_OVERLAY_PLACEHOLDERS.techSpecification,
      );
    } else if (portalSettings?.isRfqItemTechSpecRequired) {
      throw new Error(`Tech specification is required by portal settings for item row ${rowIndex + 1}`);
    }
    if (row.qty !== undefined && row.qty !== null) {
      await this.table.fillInput(rowIndex, 'qty', String(row.qty));
    }
    if (row.remarks) {
      await this.table.fillTextareaOverlayCell(
        rowIndex,
        'remarks',
        row.remarks,
        RFQ_ITEM_GRID_OVERLAY_PLACEHOLDERS.remarks,
      );
    }
    if (row.attachmentFile) {
      await this.uploadAttachment(rowIndex, row.attachmentFile);
    }
    await this.table.page.keyboard.press('Tab');
  }

  async fillAll(
    rows: RequestForQuotationItemRowData[] = [],
    portalSettings?: RfqPortalSettings,
  ): Promise<void> {
    for (let i = 0; i < rows.length; i++) {
      await this.fillRow(i, rows[i], portalSettings);
    }
  }
}
