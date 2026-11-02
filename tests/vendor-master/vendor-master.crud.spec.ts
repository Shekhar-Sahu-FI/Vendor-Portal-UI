import { test, expect } from '../../src/fixtures/test.fixture';
import { VENDOR_GRID } from '../../src/pages/vendor-master/vendor-master.constants';
import { buildVendorMasterData } from '../../src/utils/test-data/master-data';

test.describe('Vendor Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a vendor', async ({
    vendorMasterListPage,
    vendorMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildVendorMasterData(marker);

    // 1. Create new vendor
    await vendorMasterListPage.open();
    await vendorMasterListPage.createNew();
    await vendorMasterFormPage.fill(data);
    await vendorMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await vendorMasterListPage.open();
    await vendorMasterListPage.grid.filterByColumnPlaceholder(
      VENDOR_GRID.vendorNameFilterPlaceholder,
      data.vendorName,
      { listUrlPattern: /\/api\/master\/vendor-master/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.vendorName);

    // 3. Open and Update
    await vendorMasterListPage.openSavedRecordForEdit(data.vendorName);
    await expect(page).toHaveURL(/\/vendor-master\/\d+\/edit/);

    const updatedVendorName = `Vendor Upd ${marker}`.slice(0, 100);
    await vendorMasterFormPage.updateVendorName(updatedVendorName);
    await vendorMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await vendorMasterListPage.open();
    await vendorMasterListPage.openSavedRecordForEdit(updatedVendorName);
    await vendorMasterFormPage.deleteCurrent();

    await vendorMasterListPage.open();
    await vendorMasterListPage.grid.filterByColumnPlaceholder(
      VENDOR_GRID.vendorNameFilterPlaceholder,
      updatedVendorName,
      { listUrlPattern: /\/api\/master\/vendor-master/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedVendorName }),
    ).toHaveCount(0);
  });
});
