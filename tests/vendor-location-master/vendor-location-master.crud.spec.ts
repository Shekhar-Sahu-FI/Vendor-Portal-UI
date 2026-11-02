import { test, expect } from '../../src/fixtures/test.fixture';
import { VENDOR_LOCATION_GRID } from '../../src/pages/vendor-location-master/vendor-location-master.constants';
import { buildVendorLocationData } from '../../src/utils/test-data/master-data';

test.describe('Vendor Location Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a vendor location', async ({
    vendorLocationMasterListPage,
    vendorLocationMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildVendorLocationData(marker);

    // 1. Create new vendor location
    await vendorLocationMasterListPage.open();
    await vendorLocationMasterListPage.createNew();
    await vendorLocationMasterFormPage.fill(data);
    await vendorLocationMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await vendorLocationMasterListPage.open();
    await vendorLocationMasterListPage.grid.filterByColumnPlaceholder(
      VENDOR_LOCATION_GRID.locationNameFilterPlaceholder,
      data.locationName,
      { listUrlPattern: /\/api\/master\/vendor-locations/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.locationName);

    // 3. Open and Update
    await vendorLocationMasterListPage.openSavedRecordForEdit(data.locationName);
    await expect(page).toHaveURL(/\/vendor-location-master\/\d+\/edit/);

    const updatedLocationName = `VLoc Upd ${marker}`.slice(0, 100);
    await vendorLocationMasterFormPage.updateLocationName(updatedLocationName);
    await vendorLocationMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await vendorLocationMasterListPage.open();
    await vendorLocationMasterListPage.openSavedRecordForEdit(updatedLocationName);
    await vendorLocationMasterFormPage.deleteCurrent();

    await vendorLocationMasterListPage.open();
    await vendorLocationMasterListPage.grid.filterByColumnPlaceholder(
      VENDOR_LOCATION_GRID.locationNameFilterPlaceholder,
      updatedLocationName,
      { listUrlPattern: /\/api\/master\/vendor-locations/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedLocationName }),
    ).toHaveCount(0);
  });
});
