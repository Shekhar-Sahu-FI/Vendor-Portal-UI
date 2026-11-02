import { test, expect } from '../../src/fixtures/test.fixture';
import { UNIT_GRID } from '../../src/pages/unit-master/unit-master.constants';
import { buildUnitData } from '../../src/utils/test-data/master-data';

test.describe('Unit Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a unit', async ({
    unitMasterListPage,
    unitMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildUnitData(marker);

    // 1. Create new unit
    await unitMasterListPage.open();
    await unitMasterListPage.createNew();
    await unitMasterFormPage.fill(data);
    await unitMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await unitMasterListPage.open();
    await unitMasterListPage.grid.filterByColumnPlaceholder(
      UNIT_GRID.unitNameFilterPlaceholder,
      data.unitName,
      { listUrlPattern: /\/api\/units/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.unitName);

    // 3. Open and Update
    await unitMasterListPage.openSavedRecordForEdit(data.unitName);
    await expect(page).toHaveURL(/\/unit-master\/\d+\/edit/);

    const updatedUnitName = `U Upd ${marker}`.slice(0, 25);
    await unitMasterFormPage.updateUnitName(updatedUnitName);
    await unitMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await unitMasterListPage.open();
    await unitMasterListPage.openSavedRecordForEdit(updatedUnitName);
    await unitMasterFormPage.deleteCurrent();

    await unitMasterListPage.open();
    await unitMasterListPage.grid.filterByColumnPlaceholder(
      UNIT_GRID.unitNameFilterPlaceholder,
      updatedUnitName,
      { listUrlPattern: /\/api\/units/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedUnitName }),
    ).toHaveCount(0);
  });
});
