import { test, expect } from '../../src/fixtures/test.fixture';
import { ITEM_MASTER_GRID } from '../../src/pages/item-master/item-master.constants';
import { imExpectField, imExpectUrl } from '../../src/pages/item-master/item-master.assert.messages';
import { buildItemMasterSaveData } from '../../src/utils/test-data/item-master.data';

test.describe('Item Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete an item', async ({
    itemMasterListPage,
    itemMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildItemMasterSaveData(marker);

    // 1. Create new item
    await itemMasterListPage.open();
    await itemMasterListPage.createNew();
    await itemMasterFormPage.fill(data);
    const itemCode = await itemMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await itemMasterListPage.open();
    await itemMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_MASTER_GRID.itemCodeFilterPlaceholder,
      itemCode,
      { listUrlPattern: /\/api\/master\/items/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      imExpectField(ITEM_MASTER_GRID.itemCodeColumn, itemCode),
    ).toContainText(itemCode);
    await expect(
      firstRow,
      imExpectField(ITEM_MASTER_GRID.itemNameColumn, data.itemName!),
    ).toContainText(data.itemName!);

    // 3. Open and Update
    await itemMasterListPage.openSavedRecordForEdit(itemCode);
    await expect(
      page,
      imExpectUrl('to open Item in edit mode'),
    ).toHaveURL(/\/item-master\/\d+\/edit/);

    const updatedItemName = `Updated Item ${marker}`.slice(0, 50);
    await itemMasterFormPage.updateItemName(updatedItemName);

    // 4. Delete & Verify removal
    await itemMasterListPage.open();
    await itemMasterListPage.openSavedRecordForEdit(itemCode);
    await itemMasterFormPage.deleteCurrent('Automated cleanup');

    await itemMasterListPage.open();
    await itemMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_MASTER_GRID.itemCodeFilterPlaceholder,
      itemCode,
      { listUrlPattern: /\/api\/master\/items/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: itemCode }),
      imExpectField(ITEM_MASTER_GRID.itemCodeColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
