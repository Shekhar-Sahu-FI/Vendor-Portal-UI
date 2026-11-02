import { Page } from '@playwright/test';
import { ItemMasterMakeRowData } from '../../../types/item-master.types';
import { MAKE_DETAIL_LABELS as L } from '../item-master.constants';
import { IM_MAKE_GRID_COLUMNS } from '../grids/item-master-grid.columns';
import { DataCellTable } from '../../../utils/data-cell-table';
import { FormFieldHelper } from '../../../utils/form-field.helper';

export class ItemMasterMakeDetailSection {
  readonly fields: FormFieldHelper;
  private readonly table: DataCellTable<typeof IM_MAKE_GRID_COLUMNS>;

  constructor(private readonly page: Page) {
    this.fields = new FormFieldHelper(page);
    this.table = new DataCellTable(page, IM_MAKE_GRID_COLUMNS);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async fillMakeRow(rowIndex: number, row: ItemMasterMakeRowData): Promise<void> {
    if (row.makeAlias) {
      await this.table.selectSuggestion(
        rowIndex,
        'makeCode',
        row.makeAlias.query,
        row.makeAlias.value,
      );
    }
    if (row.makeName) {
      await this.table.selectSuggestion(
        rowIndex,
        'makeName',
        row.makeName.query,
        row.makeName.value,
      );
    }
  }

  async fillAll(data: {
    makeMgmtType?: string;
    makeRows?: ItemMasterMakeRowData[];
  } = {}): Promise<void> {
    if (this.hasValue(data.makeMgmtType)) {
      await this.fields.selectDropdownByLabel(L.makeMgmtType, data.makeMgmtType);
    }
    if (data.makeMgmtType === 'Selected' && data.makeRows?.length) {
      for (let i = 0; i < data.makeRows.length; i++) {
        await this.fillMakeRow(i, data.makeRows[i]);
      }
    }
  }
}
