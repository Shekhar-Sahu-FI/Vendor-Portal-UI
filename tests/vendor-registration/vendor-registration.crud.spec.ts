import { test, expect } from '../../src/fixtures/test.fixture';
import { VENDOR_REGISTRATION_GRID } from '../../src/pages/vendor-registration/vendor-registration.constants';
import { vendorRegistrationExpectField, vendorRegistrationExpectUrl } from '../../src/pages/vendor-registration/vendor-registration.assert.messages';
import { buildVendorRegistrationData } from '../../src/utils/test-data/master-data';

test.describe('Vendor Registration - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a vendor registration', async ({
    vendorRegistrationListPage,
    vendorRegistrationFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildVendorRegistrationData(marker);

    // 1. Create new vendor registration
    await vendorRegistrationListPage.open();
    await vendorRegistrationListPage.createNew();
    await vendorRegistrationFormPage.fill(data);
    const code = await vendorRegistrationFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await vendorRegistrationListPage.open();
    await vendorRegistrationListPage.grid.filterByColumnPlaceholder(
      VENDOR_REGISTRATION_GRID.vendorNameFilterPlaceholder,
      data.vendorName,
      { listUrlPattern: /\/api\/master\/vendor/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      vendorRegistrationExpectField(VENDOR_REGISTRATION_GRID.vendorNameColumn, data.vendorName),
    ).toContainText(data.vendorName);

    // 3. Open and Update
    await vendorRegistrationListPage.openSavedRecordForEdit(data.vendorName);
    await expect(
      page,
      vendorRegistrationExpectUrl('to open Vendor in edit mode'),
    ).toHaveURL(/\/vendor-master\/\d+\/edit/);

    const updatedVendorName = `Updated Vendor ${marker}`.slice(0, 100);
    await vendorRegistrationFormPage.updateVendorName(updatedVendorName);

    // 4. Delete & Verify removal
    await vendorRegistrationListPage.open();
    await vendorRegistrationListPage.openSavedRecordForEdit(updatedVendorName);
    await vendorRegistrationFormPage.deleteCurrent('Automated cleanup');

    await vendorRegistrationListPage.open();
    await vendorRegistrationListPage.grid.filterByColumnPlaceholder(
      VENDOR_REGISTRATION_GRID.vendorNameFilterPlaceholder,
      updatedVendorName,
      { listUrlPattern: /\/api\/master\/vendor/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedVendorName }),
      vendorRegistrationExpectField(VENDOR_REGISTRATION_GRID.vendorNameColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
