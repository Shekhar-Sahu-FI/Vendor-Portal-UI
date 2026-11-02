import { Page } from '@playwright/test';
import { AutoSuggestField } from '../../../types/purchase-request.types';
import { DataCellTable } from '../../../utils/data-cell-table';
import { PR_INFORM_GRID_COLUMNS } from '../grids/purchase-request-grid.columns';

export class PurchaseRequestInformToSection {
  private readonly table: DataCellTable<typeof PR_INFORM_GRID_COLUMNS>;

  constructor(page: Page) {
    this.table = new DataCellTable(page, PR_INFORM_GRID_COLUMNS);
  }

  async fillRow(rowIndex: number, field: AutoSuggestField): Promise<void> {
    await this.table.selectSuggestion(rowIndex, 'userName', field.query, field.value);
    await this.table.page.keyboard.press('Tab');
  }

  async fillAll(rows: AutoSuggestField[] = []): Promise<void> {
    for (let i = 0; i < rows.length; i++) {
      await this.fillRow(i, rows[i]);
    }
  }
}
