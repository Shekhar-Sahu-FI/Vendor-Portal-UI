import { test, expect } from '../../src/fixtures/test.fixture';
import { CS_REASON_GRID } from '../../src/pages/cs-reason-master/cs-reason-master.constants';
import { buildCSReasonData } from '../../src/utils/test-data/master-data';

test.describe('CS Reason Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a CS reason', async ({
    csReasonMasterListPage,
    csReasonMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildCSReasonData(marker);

    // 1. Create new CS reason
    await csReasonMasterListPage.open();
    await csReasonMasterListPage.createNew();
    await csReasonMasterFormPage.fill(data);
    await csReasonMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await csReasonMasterListPage.open();
    await csReasonMasterListPage.grid.filterByColumnPlaceholder(
      CS_REASON_GRID.reasonNameFilterPlaceholder,
      data.reasonName,
      { listUrlPattern: /\/api\/master\/cs-reasons/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.reasonName);

    // 3. Open and Update
    await csReasonMasterListPage.openSavedRecordForEdit(data.reasonName);
    await expect(page).toHaveURL(/\/cs-reason-master\/\d+\/edit/);

    const updatedReasonName = `CSR Upd ${marker}`.slice(0, 100);
    await csReasonMasterFormPage.updateReasonName(updatedReasonName);
    await csReasonMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await csReasonMasterListPage.open();
    await csReasonMasterListPage.openSavedRecordForEdit(updatedReasonName);
    await csReasonMasterFormPage.deleteCurrent();

    await csReasonMasterListPage.open();
    await csReasonMasterListPage.grid.filterByColumnPlaceholder(
      CS_REASON_GRID.reasonNameFilterPlaceholder,
      updatedReasonName,
      { listUrlPattern: /\/api\/master\/cs-reasons/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedReasonName }),
    ).toHaveCount(0);
  });
});
