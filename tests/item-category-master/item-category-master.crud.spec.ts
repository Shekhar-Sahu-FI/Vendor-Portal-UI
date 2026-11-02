import { test, expect } from '../../src/fixtures/test.fixture';
import { ITEM_CATEGORY_GRID } from '../../src/pages/item-category-master/item-category-master.constants';
import { itemCategoryExpectField, itemCategoryExpectUrl } from '../../src/pages/item-category-master/item-category-master.assert.messages';
import { buildCategoryData } from '../../src/utils/test-data/master-data';

test.describe('Item Category Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete an item category', async ({
    itemCategoryMasterListPage,
    itemCategoryMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildCategoryData(marker);

    // 1. Create new category
    await itemCategoryMasterListPage.open();
    await itemCategoryMasterListPage.createNew();
    await itemCategoryMasterFormPage.fill(data);
    const code = await itemCategoryMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await itemCategoryMasterListPage.open();
    await itemCategoryMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_CATEGORY_GRID.codeFilterPlaceholder,
      code,
      { listUrlPattern: /\/api\/master\/categories/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      itemCategoryExpectField(ITEM_CATEGORY_GRID.codeColumn, code),
    ).toContainText(code);
    await expect(
      firstRow,
      itemCategoryExpectField(ITEM_CATEGORY_GRID.categoryNameColumn, data.categoryName),
    ).toContainText(data.categoryName);

    // 3. Open and Update
    await itemCategoryMasterListPage.openSavedRecordForEdit(code);
    await expect(
      page,
      itemCategoryExpectUrl('to open Item Category in edit mode'),
    ).toHaveURL(/\/item-category-master\/\d+\/edit/);

    const updatedCategoryName = `Updated Category ${marker}`;
    await itemCategoryMasterFormPage.updateCategoryName(updatedCategoryName);

    // Verify updated category in grid
    await itemCategoryMasterListPage.open();
    await itemCategoryMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_CATEGORY_GRID.codeFilterPlaceholder,
      code,
      { listUrlPattern: /\/api\/master\/categories/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').first(),
      itemCategoryExpectField(ITEM_CATEGORY_GRID.categoryNameColumn, updatedCategoryName),
    ).toContainText(updatedCategoryName);

    // 4. Delete & Verify removal
    await itemCategoryMasterListPage.openSavedRecordForEdit(code);
    await itemCategoryMasterFormPage.deleteCurrent('Automated cleanup');

    await itemCategoryMasterListPage.open();
    await itemCategoryMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_CATEGORY_GRID.codeFilterPlaceholder,
      code,
      { listUrlPattern: /\/api\/master\/categories/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: code }),
      itemCategoryExpectField(ITEM_CATEGORY_GRID.codeColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
