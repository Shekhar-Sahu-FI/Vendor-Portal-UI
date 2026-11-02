import { test, expect } from '../../src/fixtures/test.fixture';
import { ITEM_SUBGROUP_GRID } from '../../src/pages/item-subgroup-master/item-subgroup-master.constants';
import { buildSubgroupData } from '../../src/utils/test-data/master-data';

test.describe('Item Subgroup Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete an item subgroup', async ({
    itemSubgroupMasterListPage,
    itemSubgroupMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildSubgroupData(marker);

    // 1. Create new item subgroup
    await itemSubgroupMasterListPage.open();
    await itemSubgroupMasterListPage.createNew();
    await itemSubgroupMasterFormPage.fill(data);
    await itemSubgroupMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await itemSubgroupMasterListPage.open();
    await itemSubgroupMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_SUBGROUP_GRID.subGroupNameFilterPlaceholder,
      data.subGroupName,
      { listUrlPattern: /\/api\/master\/subgroups/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.subGroupName);

    // 3. Open and Update
    await itemSubgroupMasterListPage.openSavedRecordForEdit(data.subGroupName);
    await expect(page).toHaveURL(/\/item-subgroup-master\/\d+\/edit/);

    const updatedSubgroupName = `Subgrp Upd ${marker}`.slice(0, 100);
    await itemSubgroupMasterFormPage.updateSubgroupName(updatedSubgroupName);
    await itemSubgroupMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await itemSubgroupMasterListPage.open();
    await itemSubgroupMasterListPage.openSavedRecordForEdit(updatedSubgroupName);
    await itemSubgroupMasterFormPage.deleteCurrent();

    await itemSubgroupMasterListPage.open();
    await itemSubgroupMasterListPage.grid.filterByColumnPlaceholder(
      ITEM_SUBGROUP_GRID.subGroupNameFilterPlaceholder,
      updatedSubgroupName,
      { listUrlPattern: /\/api\/master\/subgroups/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedSubgroupName }),
    ).toHaveCount(0);
  });
});
