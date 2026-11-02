import { test, expect } from '../../src/fixtures/test.fixture';
import { STATE_GRID } from '../../src/pages/state-master/state-master.constants';
import { buildStateData } from '../../src/utils/test-data/master-data';

test.describe('State Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a state', async ({
    stateMasterListPage,
    stateMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildStateData(marker);

    // 1. Create new state
    await stateMasterListPage.open();
    await stateMasterListPage.createNew();
    await stateMasterFormPage.fill(data);
    await stateMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await stateMasterListPage.open();
    await stateMasterListPage.grid.filterByColumnPlaceholder(
      STATE_GRID.stateNameFilterPlaceholder,
      data.stateName,
      { listUrlPattern: /\/api\/master\/states/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.stateName);

    // 3. Open and Update
    await stateMasterListPage.openSavedRecordForEdit(data.stateName);
    await expect(page).toHaveURL(/\/state-master\/\d+\/edit/);

    const updatedStateName = `State Upd ${marker}`.slice(0, 100);
    await stateMasterFormPage.updateStateName(updatedStateName);
    await stateMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await stateMasterListPage.open();
    await stateMasterListPage.openSavedRecordForEdit(updatedStateName);
    await stateMasterFormPage.deleteCurrent();

    await stateMasterListPage.open();
    await stateMasterListPage.grid.filterByColumnPlaceholder(
      STATE_GRID.stateNameFilterPlaceholder,
      updatedStateName,
      { listUrlPattern: /\/api\/master\/states/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedStateName }),
    ).toHaveCount(0);
  });
});
