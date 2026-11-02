import { test, expect } from '../../src/fixtures/test.fixture';
import { PRIORITY_GRID } from '../../src/pages/priority-master/priority-master.constants';
import { buildPriorityData } from '../../src/utils/test-data/master-data';

test.describe('Priority Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a priority', async ({
    priorityMasterListPage,
    priorityMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildPriorityData(marker);

    // 1. Create new priority
    await priorityMasterListPage.open();
    await priorityMasterListPage.createNew();
    await priorityMasterFormPage.fill(data);
    await priorityMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await priorityMasterListPage.open();
    await priorityMasterListPage.grid.filterByColumnPlaceholder(
      PRIORITY_GRID.priorityNameFilterPlaceholder,
      data.priorityName,
      { listUrlPattern: /\/api\/master\/priorities/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.priorityName);

    // 3. Open and Update
    await priorityMasterListPage.openSavedRecordForEdit(data.priorityName);
    await expect(page).toHaveURL(/\/priority-master\/\d+\/edit/);

    const updatedPriorityName = `Prio Upd ${marker}`.slice(0, 100);
    await priorityMasterFormPage.updatePriorityName(updatedPriorityName);
    await priorityMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await priorityMasterListPage.open();
    await priorityMasterListPage.openSavedRecordForEdit(updatedPriorityName);
    await priorityMasterFormPage.deleteCurrent();

    await priorityMasterListPage.open();
    await priorityMasterListPage.grid.filterByColumnPlaceholder(
      PRIORITY_GRID.priorityNameFilterPlaceholder,
      updatedPriorityName,
      { listUrlPattern: /\/api\/master\/priorities/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedPriorityName }),
    ).toHaveCount(0);
  });
});
