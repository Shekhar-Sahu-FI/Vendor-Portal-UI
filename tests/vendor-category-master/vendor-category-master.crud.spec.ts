import { test, expect } from '../../src/fixtures/test.fixture';
import { VENDOR_CATEGORY_GRID } from '../../src/pages/vendor-category-master/vendor-category-master.constants';
import { buildVendorCategoryData } from '../../src/utils/test-data/master-data';

test.describe('Vendor Category Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a vendor category', async ({
    vendorCategoryMasterListPage,
    vendorCategoryMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildVendorCategoryData(marker);

    // 1. Create new vendor category
    await vendorCategoryMasterListPage.open();
    await vendorCategoryMasterListPage.createNew();
    await vendorCategoryMasterFormPage.fill(data);
    await vendorCategoryMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await vendorCategoryMasterListPage.open();
    await vendorCategoryMasterListPage.grid.filterByColumnPlaceholder(
      VENDOR_CATEGORY_GRID.vendorCategoryNameFilterPlaceholder,
      data.vendorCategoryName,
      { listUrlPattern: /\/api\/master\/vendor-categories/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.vendorCategoryName);

    // 3. Open and Update
    await vendorCategoryMasterListPage.openSavedRecordForEdit(data.vendorCategoryName);
    await expect(page).toHaveURL(/\/vendor-category-master\/\d+\/edit/);

    const updatedVendorCategoryName = `VCat Upd ${marker}`.slice(0, 100);
    await vendorCategoryMasterFormPage.updateVendorCategoryName(updatedVendorCategoryName);
    await vendorCategoryMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await vendorCategoryMasterListPage.open();
    await vendorCategoryMasterListPage.openSavedRecordForEdit(updatedVendorCategoryName);
    await vendorCategoryMasterFormPage.deleteCurrent();

    await vendorCategoryMasterListPage.open();
    await vendorCategoryMasterListPage.grid.filterByColumnPlaceholder(
      VENDOR_CATEGORY_GRID.vendorCategoryNameFilterPlaceholder,
      updatedVendorCategoryName,
      { listUrlPattern: /\/api\/master\/vendor-categories/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedVendorCategoryName }),
    ).toHaveCount(0);
  });
});
