import { test, expect } from '../../src/fixtures/test.fixture';
import { COMPANY_LOCATION_GRID } from '../../src/pages/company-location-master/company-location-master.constants';
import { companyLocationExpectField, companyLocationExpectUrl } from '../../src/pages/company-location-master/company-location-master.assert.messages';
import { buildCompanyLocationData } from '../../src/utils/test-data/master-data';

test.describe('Company Location Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a company location', async ({
    companyLocationMasterListPage,
    companyLocationMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildCompanyLocationData(marker);

    // 1. Create new company location
    await companyLocationMasterListPage.open();
    await companyLocationMasterListPage.createNew();
    await companyLocationMasterFormPage.fill(data);
    const code = await companyLocationMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await companyLocationMasterListPage.open();
    await companyLocationMasterListPage.grid.filterByColumnPlaceholder(
      COMPANY_LOCATION_GRID.address1FilterPlaceholder,
      data.address1,
      { listUrlPattern: /\/api\/master\/company\/locations/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      companyLocationExpectField(COMPANY_LOCATION_GRID.address1Column, data.address1),
    ).toContainText(data.address1);

    // 3. Open and Update
    await companyLocationMasterListPage.openSavedRecordForEdit(data.address1);
    await expect(
      page,
      companyLocationExpectUrl('to open Company Location in edit mode'),
    ).toHaveURL(/\/company-location-master\/\d+\/edit/);

    const updatedAddress = `Site ${marker} Updated Area`;
    await companyLocationMasterFormPage.updateAddress(updatedAddress);

    // 4. Delete & Verify removal
    await companyLocationMasterListPage.open();
    await companyLocationMasterListPage.openSavedRecordForEdit(updatedAddress);
    await companyLocationMasterFormPage.deleteCurrent('Automated cleanup');

    await companyLocationMasterListPage.open();
    await companyLocationMasterListPage.grid.filterByColumnPlaceholder(
      COMPANY_LOCATION_GRID.address1FilterPlaceholder,
      updatedAddress,
      { listUrlPattern: /\/api\/master\/company\/locations/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedAddress }),
      companyLocationExpectField(COMPANY_LOCATION_GRID.address1Column, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
