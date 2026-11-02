import { test, expect } from '../../src/fixtures/test.fixture';
import { ITEM_GROUP_GRID } from '../../src/pages/item-group-master/item-group-master.constants';
import { itemGroupExpectField, itemGroupExpectUrl } from '../../src/pages/item-group-master/item-group-master.assert.messages';
import { buildGroupData } from '../../src/utils/test-data/master-data';

test.describe('Item Group Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete an item group', async ({
    itemGroupMasterListPage,
    itemGroupMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildGroupData(marker);

    // 1. Create new item group
    await itemGroupMasterListPage.open();
    await itemGroupMasterListPage.createNew();
    await itemGroupMasterFormPage.fill(data);
    const code = await itemGroupMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await itemGroupMasterListPage.open();
    await itemGroupMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_GROUP_GRID.groupNameFilterPlaceholder,
      data.groupName,
      { listUrlPattern: /\/api\/master\/groups/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      itemGroupExpectField(ITEM_GROUP_GRID.groupNameColumn, data.groupName),
    ).toContainText(data.groupName);

    // 3. Open and Update
    await itemGroupMasterListPage.openSavedRecordForEdit(data.groupName);
    await expect(
      page,
      itemGroupExpectUrl('to open Item Group in edit mode'),
    ).toHaveURL(/\/item-group-master\/\d+\/edit/);

    const updatedGroupName = `Updated Group ${marker}`;
    await itemGroupMasterFormPage.updateGroupName(updatedGroupName);

    // Verify updated group in grid
    await itemGroupMasterListPage.open();
    await itemGroupMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_GROUP_GRID.groupNameFilterPlaceholder,
      updatedGroupName,
      { listUrlPattern: /\/api\/master\/groups/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').first(),
      itemGroupExpectField(ITEM_GROUP_GRID.groupNameColumn, updatedGroupName),
    ).toContainText(updatedGroupName);

    // 4. Delete & Verify removal
    await itemGroupMasterListPage.openSavedRecordForEdit(updatedGroupName);
    await itemGroupMasterFormPage.deleteCurrent('Automated cleanup');

    await itemGroupMasterListPage.open();
    await itemGroupMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_GROUP_GRID.groupNameFilterPlaceholder,
      updatedGroupName,
      { listUrlPattern: /\/api\/master\/groups/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedGroupName }),
      itemGroupExpectField(ITEM_GROUP_GRID.groupNameColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
