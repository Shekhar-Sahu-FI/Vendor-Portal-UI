import { test, expect } from '../../src/fixtures/test.fixture';
import { REGION_GRID } from '../../src/pages/region-master/region-master.constants';
import { buildRegionData } from '../../src/utils/test-data/master-data';

test.describe('Region Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a region', async ({
    regionMasterListPage,
    regionMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildRegionData(marker);

    // 1. Create new region
    await regionMasterListPage.open();
    await regionMasterListPage.createNew();
    await regionMasterFormPage.fill(data);
    await regionMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await regionMasterListPage.open();
    await regionMasterListPage.grid.filterByColumnPlaceholder(
      REGION_GRID.regionNameFilterPlaceholder,
      data.regionName,
      { listUrlPattern: /\/api\/master\/regions/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.regionName);

    // 3. Open and Update
    await regionMasterListPage.openSavedRecordForEdit(data.regionName);
    await expect(page).toHaveURL(/\/region-master\/\d+\/edit/);

    const updatedRegionName = `Region Upd ${marker}`.slice(0, 100);
    await regionMasterFormPage.updateRegionName(updatedRegionName);
    await regionMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await regionMasterListPage.open();
    await regionMasterListPage.openSavedRecordForEdit(updatedRegionName);
    await regionMasterFormPage.deleteCurrent();

    await regionMasterListPage.open();
    await regionMasterListPage.grid.filterByColumnPlaceholder(
      REGION_GRID.regionNameFilterPlaceholder,
      updatedRegionName,
      { listUrlPattern: /\/api\/master\/regions/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedRegionName }),
    ).toHaveCount(0);
  });
});
