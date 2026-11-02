import { test, expect } from '../../src/fixtures/test.fixture';
import { ITEM_MASTER_GRID } from '../../src/pages/item-master/item-master.constants';
import { imExpectField } from '../../src/pages/item-master/item-master.assert.messages';
import { buildItemMasterSaveData } from '../../src/utils/test-data/item-master.data';

test.describe('Item Master - Save', () => {
  test('should create a new item with mandatory fields', async ({
    itemMasterListPage,
    itemMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildItemMasterSaveData(marker);

    await itemMasterListPage.open();
    await itemMasterListPage.createNew();
    await itemMasterFormPage.fill(data);
    const itemCode = await itemMasterFormPage.saveAndConfirm();

    await itemMasterListPage.open();
    await itemMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_MASTER_GRID.itemCodeFilterPlaceholder,
      itemCode,
      { listUrlPattern: /\/api\/master\/items/i },
    );

    await expect(
      page.locator('.search-data-grid tbody tr').first(),
      imExpectField(ITEM_MASTER_GRID.itemCodeColumn, itemCode),
    ).toContainText(itemCode);
    await expect(
      page.locator('.search-data-grid tbody tr').first(),
      imExpectField(ITEM_MASTER_GRID.itemNameColumn, data.itemName!),
    ).toContainText(data.itemName!);
  });
});
