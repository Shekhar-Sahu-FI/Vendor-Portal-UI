import { Page } from '@playwright/test';
import { ItemMasterUnitConversionRowData } from '../../../types/item-master.types';
import { UNIT_CONVERSION_LABELS as L } from '../item-master.constants';
import { IM_UNIT_CONVERSION_GRID_COLUMNS } from '../grids/item-master-grid.columns';
import { DataCellTable } from '../../../utils/data-cell-table';
import { selectDropdownInCell } from '../item-master-grid.helper';

export class ItemMasterUnitConversionDetailSection {
  private readonly table: DataCellTable<typeof IM_UNIT_CONVERSION_GRID_COLUMNS>;

  constructor(private readonly page: Page) {
    this.table = new DataCellTable(page, IM_UNIT_CONVERSION_GRID_COLUMNS);
  }

  private hasValue(value: string | undefined): value is string {
    return value !== undefined && value !== null && String(value).trim() !== '';
  }

  async enableMultipleUnit(): Promise<void> {
    const checkbox = this.page.locator('[name="isMultipleUnitApplicable"]');
    await checkbox.check();
  }

  async fillUnitRow(rowIndex: number, row: ItemMasterUnitConversionRowData): Promise<void> {
    if (row.unitType) {
      await selectDropdownInCell(this.table.cell(rowIndex, 'unitTypeId'), row.unitType);
    }
    if (row.conversionType) {
      await selectDropdownInCell(this.table.cell(rowIndex, 'unitConversionTypeId'), row.conversionType);
    }
    if (this.hasValue(row.fromUnitValue)) {
      await this.table.fillInput(rowIndex, 'fromUnitValue', row.fromUnitValue);
    }
    if (row.toUnit) {
      await this.table.selectSuggestion(
        rowIndex,
        'toUnitId',
        row.toUnit.query,
        row.toUnit.value,
      );
    }
    if (this.hasValue(row.toUnitValue)) {
      await this.table.fillInput(rowIndex, 'toUnitValue', row.toUnitValue);
    }
  }

  async fillAll(data: {
    isMultipleUnitApplicable?: boolean;
    unitConversionRows?: ItemMasterUnitConversionRowData[];
  } = {}): Promise<void> {
    if (!data.isMultipleUnitApplicable) {
      return;
    }
    await this.enableMultipleUnit();
    if (data.unitConversionRows?.length) {
      for (let i = 0; i < data.unitConversionRows.length; i++) {
        await this.fillUnitRow(i, data.unitConversionRows[i]);
      }
    }
  }
}
