import { test, expect } from '../../src/fixtures/test.fixture';
import { DIVISION_GRID } from '../../src/pages/division-master/division-master.constants';
import { divisionExpectField, divisionExpectUrl } from '../../src/pages/division-master/division-master.assert.messages';
import { buildDivisionData } from '../../src/utils/test-data/master-data';

test.describe('Division Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a division', async ({
    divisionMasterListPage,
    divisionMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildDivisionData(marker);

    // 1. Create new division
    await divisionMasterListPage.open();
    await divisionMasterListPage.createNew();
    await divisionMasterFormPage.fill(data);
    const code = await divisionMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await divisionMasterListPage.open();
    await divisionMasterListPage.grid.filterByColumnPlaceholder(
      DIVISION_GRID.divisionNameFilterPlaceholder,
      data.divisionName,
      { listUrlPattern: /\/api\/master\/divisions/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      divisionExpectField(DIVISION_GRID.divisionNameColumn, data.divisionName),
    ).toContainText(data.divisionName);

    // 3. Open and Update
    await divisionMasterListPage.openSavedRecordForEdit(data.divisionName);
    await expect(
      page,
      divisionExpectUrl('to open Division in edit mode'),
    ).toHaveURL(/\/division-master\/\d+\/edit/);

    const updatedDivisionName = `Updated Division ${marker}`.slice(0, 100);
    await divisionMasterFormPage.updateDivisionName(updatedDivisionName);

    // 4. Delete & Verify removal
    await divisionMasterListPage.open();
    await divisionMasterListPage.openSavedRecordForEdit(updatedDivisionName);
    await divisionMasterFormPage.deleteCurrent('Automated cleanup');

    await divisionMasterListPage.open();
    await divisionMasterListPage.grid.filterByColumnPlaceholder(
      DIVISION_GRID.divisionNameFilterPlaceholder,
      updatedDivisionName,
      { listUrlPattern: /\/api\/master\/divisions/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedDivisionName }),
      divisionExpectField(DIVISION_GRID.divisionNameColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
