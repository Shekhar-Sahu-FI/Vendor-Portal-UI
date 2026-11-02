import { test, expect } from '../../src/fixtures/test.fixture';
import { LOCATION_GRID } from '../../src/pages/location-master/location-master.constants';
import { locationExpectField, locationExpectUrl } from '../../src/pages/location-master/location-master.assert.messages';
import { buildLocationData } from '../../src/utils/test-data/master-data';

test.describe('Location Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a location', async ({
    locationMasterListPage,
    locationMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildLocationData(marker);

    // 1. Create new location
    await locationMasterListPage.open();
    await locationMasterListPage.createNew();
    await locationMasterFormPage.fill(data);
    const code = await locationMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await locationMasterListPage.open();
    await locationMasterListPage.grid.filterByColumnPlaceholder(
      LOCATION_GRID.locationNameFilterPlaceholder,
      data.locationName,
      { listUrlPattern: /\/api\/master\/locations/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      locationExpectField(LOCATION_GRID.locationNameColumn, data.locationName),
    ).toContainText(data.locationName);

    // 3. Open and Update
    await locationMasterListPage.openSavedRecordForEdit(data.locationName);
    await expect(
      page,
      locationExpectUrl('to open Location in edit mode'),
    ).toHaveURL(/\/location-master\/\d+\/edit/);

    const updatedLocationName = `Updated Location ${marker}`.slice(0, 50);
    await locationMasterFormPage.updateLocationName(updatedLocationName);

    // Verify updated location in grid
    await locationMasterListPage.open();
    await locationMasterListPage.grid.filterByColumnPlaceholder(
      LOCATION_GRID.locationNameFilterPlaceholder,
      updatedLocationName,
      { listUrlPattern: /\/api\/master\/locations/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').first(),
      locationExpectField(LOCATION_GRID.locationNameColumn, updatedLocationName),
    ).toContainText(updatedLocationName);

    // 4. Delete & Verify removal
    await locationMasterListPage.openSavedRecordForEdit(updatedLocationName);
    await locationMasterFormPage.deleteCurrent('Automated cleanup');

    await locationMasterListPage.open();
    await locationMasterListPage.grid.filterByColumnPlaceholder(
      LOCATION_GRID.locationNameFilterPlaceholder,
      updatedLocationName,
      { listUrlPattern: /\/api\/master\/locations/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedLocationName }),
      locationExpectField(LOCATION_GRID.locationNameColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
