import { test, expect } from '../../src/fixtures/test.fixture';
import { WAREHOUSE_GRID } from '../../src/pages/warehouse-master/warehouse-master.constants';
import { warehouseExpectField, warehouseExpectUrl } from '../../src/pages/warehouse-master/warehouse-master.assert.messages';
import { buildWarehouseData } from '../../src/utils/test-data/master-data';

test.describe('Warehouse Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a warehouse', async ({
    warehouseMasterListPage,
    warehouseMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildWarehouseData(marker);

    // 1. Create new warehouse
    await warehouseMasterListPage.open();
    await warehouseMasterListPage.createNew();
    await warehouseMasterFormPage.fill(data);
    const code = await warehouseMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await warehouseMasterListPage.open();
    await warehouseMasterListPage.grid.filterByColumnPlaceholder(
      WAREHOUSE_GRID.warehouseNameFilterPlaceholder,
      data.warehouseName,
      { listUrlPattern: /\/api\/master\/warehouses/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      warehouseExpectField(WAREHOUSE_GRID.warehouseNameColumn, data.warehouseName),
    ).toContainText(data.warehouseName);

    // 3. Open and Update
    await warehouseMasterListPage.openSavedRecordForEdit(data.warehouseName);
    await expect(
      page,
      warehouseExpectUrl('to open Warehouse in edit mode'),
    ).toHaveURL(/\/warehouse-master\/\d+\/edit/);

    const updatedWarehouseName = `WH ${marker} Upd`.slice(0, 50);
    await warehouseMasterFormPage.updateWarehouseName(updatedWarehouseName);

    // 4. Delete & Verify removal
    await warehouseMasterListPage.open();
    await warehouseMasterListPage.openSavedRecordForEdit(updatedWarehouseName);
    await warehouseMasterFormPage.deleteCurrent('Automated cleanup');

    await warehouseMasterListPage.open();
    await warehouseMasterListPage.grid.filterByColumnPlaceholder(
      WAREHOUSE_GRID.warehouseNameFilterPlaceholder,
      updatedWarehouseName,
      { listUrlPattern: /\/api\/master\/warehouses/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedWarehouseName }),
      warehouseExpectField(WAREHOUSE_GRID.warehouseNameColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
