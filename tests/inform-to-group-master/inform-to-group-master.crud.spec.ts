import { test, expect } from '../../src/fixtures/test.fixture';
import { INFORM_TO_GROUP_GRID } from '../../src/pages/inform-to-group-master/inform-to-group-master.constants';
import { informToGroupExpectField, informToGroupExpectUrl } from '../../src/pages/inform-to-group-master/inform-to-group-master.assert.messages';
import { buildInformToGroupData } from '../../src/utils/test-data/master-data';

test.describe('Inform To Group Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete an inform to group', async ({
    informToGroupMasterListPage,
    informToGroupMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildInformToGroupData(marker);

    // 1. Create new inform to group
    await informToGroupMasterListPage.open();
    await informToGroupMasterListPage.createNew();
    await informToGroupMasterFormPage.fill(data);
    const code = await informToGroupMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await informToGroupMasterListPage.open();
    await informToGroupMasterListPage.grid.filterByColumnPlaceholder(
      INFORM_TO_GROUP_GRID.groupNameFilterPlaceholder,
      data.informToGroupName,
      { listUrlPattern: /\/api\/master\/inform-to-group-master/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      informToGroupExpectField(INFORM_TO_GROUP_GRID.groupNameColumn, data.informToGroupName),
    ).toContainText(data.informToGroupName);

    // 3. Open and Update
    await informToGroupMasterListPage.openSavedRecordForEdit(data.informToGroupName);
    await expect(
      page,
      informToGroupExpectUrl('to open Inform To Group in edit mode'),
    ).toHaveURL(/\/inform-to-group-master\/\d+\/edit/);

    const updatedDescription = `Updated description ${marker}`;
    await informToGroupMasterFormPage.updateDescription(updatedDescription);

    // 4. Delete & Verify removal
    await informToGroupMasterListPage.open();
    await informToGroupMasterListPage.openSavedRecordForEdit(data.informToGroupName);
    await informToGroupMasterFormPage.deleteCurrent('Automated cleanup');

    await informToGroupMasterListPage.open();
    await informToGroupMasterListPage.grid.filterByColumnPlaceholder(
      INFORM_TO_GROUP_GRID.groupNameFilterPlaceholder,
      data.informToGroupName,
      { listUrlPattern: /\/api\/master\/inform-to-group-master/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: data.informToGroupName }),
      informToGroupExpectField(INFORM_TO_GROUP_GRID.groupNameColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
