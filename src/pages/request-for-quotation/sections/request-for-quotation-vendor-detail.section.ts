import { Page } from '@playwright/test';
import { RequestForQuotationVendorRowData } from '../../../types/request-for-quotation.types';
import { DataCellTable } from '../../../utils/data-cell-table';
import { RFQ_VENDOR_GRID_COLUMNS } from '../grids/request-for-quotation-grid.columns';
import { RfqPortalSettings } from '../../../utils/portal-settings.helper';

export class RequestForQuotationVendorDetailSection {
  private readonly table: DataCellTable<typeof RFQ_VENDOR_GRID_COLUMNS>;

  constructor(page: Page) {
    this.table = new DataCellTable(page, RFQ_VENDOR_GRID_COLUMNS);
  }

  private async setGuestVendor(rowIndex: number, isGuest: boolean): Promise<void> {
    const cell = this.table.cell(rowIndex, 'isGuest');
    const checkbox = cell.locator('input[type="checkbox"]').first();
    if (isGuest) {
      await checkbox.check({ force: true });
    } else {
      await checkbox.uncheck({ force: true });
    }
  }

  async fillRow(
    rowIndex: number,
    row: RequestForQuotationVendorRowData,
    portalSettings?: RfqPortalSettings,
  ): Promise<void> {
    const useGuest = row.isGuest && portalSettings?.isRfqGuestVendorAllowed;

    if (useGuest) {
      await this.setGuestVendor(rowIndex, true);
      if (row.vendorName) {
        await this.table.fillInput(rowIndex, 'vendorName', row.vendorName);
      }
      if (row.vendorLocationName) {
        await this.table.fillInput(rowIndex, 'vendorLocationName', row.vendorLocationName);
      }
      if (row.email) {
        await this.table.fillInput(rowIndex, 'email', row.email);
      }
      if (row.contactPersonName) {
        await this.table.fillInput(rowIndex, 'contactPersonName', row.contactPersonName);
      }
      if (row.contactEmail) {
        await this.table.fillInput(rowIndex, 'contactEmail', row.contactEmail);
      }
      return;
    }

    if (row.vendor) {
      await this.table.selectSuggestion(rowIndex, 'vendorName', row.vendor.query, row.vendor.value);
    }
    if (row.vendorLocation) {
      await this.table.selectSuggestion(
        rowIndex,
        'vendorLocationName',
        row.vendorLocation.query,
        row.vendorLocation.value,
      );
    }
    if (row.contactPerson) {
      await this.table.selectSuggestion(
        rowIndex,
        'contactPersonName',
        row.contactPerson.query,
        row.contactPerson.value,
      );
    }
    await this.table.page.keyboard.press('Tab');
  }

  async fillAll(
    rows: RequestForQuotationVendorRowData[] = [],
    portalSettings?: RfqPortalSettings,
  ): Promise<void> {
    for (let i = 0; i < rows.length; i++) {
      await this.fillRow(i, rows[i], portalSettings);
    }
  }
}
