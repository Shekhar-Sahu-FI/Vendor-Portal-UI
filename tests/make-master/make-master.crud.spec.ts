import { test, expect } from '../../src/fixtures/test.fixture';
import { MAKE_GRID } from '../../src/pages/make-master/make-master.constants';
import { buildMakeData } from '../../src/utils/test-data/master-data';

test.describe('Make Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a make', async ({
    makeMasterListPage,
    makeMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildMakeData(marker);

    // 1. Create new make
    await makeMasterListPage.open();
    await makeMasterListPage.createNew();
    await makeMasterFormPage.fill(data);
    await makeMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await makeMasterListPage.open();
    await makeMasterListPage.grid.filterByColumnPlaceholder(
      MAKE_GRID.makeNameFilterPlaceholder,
      data.makeName,
      { listUrlPattern: /\/api\/makes/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.makeName);

    // 3. Open and Update
    await makeMasterListPage.openSavedRecordForEdit(data.makeName);
    await expect(page).toHaveURL(/\/make-master\/\d+\/edit/);

    const updatedMakeName = `Make Upd ${marker}`.slice(0, 100);
    await makeMasterFormPage.updateMakeName(updatedMakeName);
    await makeMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await makeMasterListPage.open();
    await makeMasterListPage.openSavedRecordForEdit(updatedMakeName);
    await makeMasterFormPage.deleteCurrent();

    await makeMasterListPage.open();
    await makeMasterListPage.grid.filterByColumnPlaceholder(
      MAKE_GRID.makeNameFilterPlaceholder,
      updatedMakeName,
      { listUrlPattern: /\/api\/makes/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedMakeName }),
    ).toHaveCount(0);
  });
});
