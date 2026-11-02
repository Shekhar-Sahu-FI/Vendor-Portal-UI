import { test, expect } from '../../src/fixtures/test.fixture';
import { COUNTRY_GRID } from '../../src/pages/country-master/country-master.constants';
import { buildCountryData } from '../../src/utils/test-data/master-data';

test.describe('Country Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a country', async ({
    countryMasterListPage,
    countryMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildCountryData(marker);

    // 1. Create new country
    await countryMasterListPage.open();
    await countryMasterListPage.createNew();
    await countryMasterFormPage.fill(data);
    await countryMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await countryMasterListPage.open();
    await countryMasterListPage.grid.filterByColumnPlaceholder(
      COUNTRY_GRID.countryNameFilterPlaceholder,
      data.countryName,
      { listUrlPattern: /\/api\/master\/countries/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.countryName);

    // 3. Open and Update
    await countryMasterListPage.openSavedRecordForEdit(data.countryName);
    await expect(page).toHaveURL(/\/country-master\/\d+\/edit/);

    const updatedCountryName = `CTRY Upd ${marker}`.slice(0, 100);
    await countryMasterFormPage.updateCountryName(updatedCountryName);
    await countryMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await countryMasterListPage.open();
    await countryMasterListPage.openSavedRecordForEdit(updatedCountryName);
    await countryMasterFormPage.deleteCurrent();

    await countryMasterListPage.open();
    await countryMasterListPage.grid.filterByColumnPlaceholder(
      COUNTRY_GRID.countryNameFilterPlaceholder,
      updatedCountryName,
      { listUrlPattern: /\/api\/master\/countries/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedCountryName }),
    ).toHaveCount(0);
  });
});
