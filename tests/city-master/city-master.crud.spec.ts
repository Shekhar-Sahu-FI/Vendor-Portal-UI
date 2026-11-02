import { test, expect } from '../../src/fixtures/test.fixture';
import { CITY_GRID } from '../../src/pages/city-master/city-master.constants';
import { buildCityData } from '../../src/utils/test-data/master-data';

test.describe('City Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a city', async ({
    cityMasterListPage,
    cityMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildCityData(marker);

    // 1. Create new city
    await cityMasterListPage.open();
    await cityMasterListPage.createNew();
    await cityMasterFormPage.fill(data);
    await cityMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await cityMasterListPage.open();
    await cityMasterListPage.grid.filterByColumnPlaceholder(
      CITY_GRID.cityNameFilterPlaceholder,
      data.cityName,
      { listUrlPattern: /\/api\/master\/cities/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.cityName);

    // 3. Open and Update
    await cityMasterListPage.openSavedRecordForEdit(data.cityName);
    await expect(page).toHaveURL(/\/city-master\/\d+\/edit/);

    const updatedCityName = `City Upd ${marker}`.slice(0, 100);
    await cityMasterFormPage.updateCityName(updatedCityName);
    await cityMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await cityMasterListPage.open();
    await cityMasterListPage.openSavedRecordForEdit(updatedCityName);
    await cityMasterFormPage.deleteCurrent();

    await cityMasterListPage.open();
    await cityMasterListPage.grid.filterByColumnPlaceholder(
      CITY_GRID.cityNameFilterPlaceholder,
      updatedCityName,
      { listUrlPattern: /\/api\/master\/cities/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedCityName }),
    ).toHaveCount(0);
  });
});
