import { test, expect } from '../../src/fixtures/test.fixture';
import { CURRENCY_GRID } from '../../src/pages/currency-master/currency-master.constants';
import { buildCurrencyData } from '../../src/utils/test-data/master-data';

test.describe('Currency Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a currency', async ({
    currencyMasterListPage,
    currencyMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildCurrencyData(marker);

    // 1. Create new currency
    await currencyMasterListPage.open();
    await currencyMasterListPage.createNew();
    await currencyMasterFormPage.fill(data);
    await currencyMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await currencyMasterListPage.open();
    await currencyMasterListPage.grid.filterByColumnPlaceholder(
      CURRENCY_GRID.currencyNameFilterPlaceholder,
      data.currencyName,
      { listUrlPattern: /\/api\/master\/currencies/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.currencyName);

    // 3. Open and Update
    await currencyMasterListPage.openSavedRecordForEdit(data.currencyName);
    await expect(page).toHaveURL(/\/currency-master\/\d+\/edit/);

    const updatedCurrencyName = `Curr Upd ${marker}`.slice(0, 100);
    await currencyMasterFormPage.updateCurrencyName(updatedCurrencyName);
    await currencyMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await currencyMasterListPage.open();
    await currencyMasterListPage.openSavedRecordForEdit(updatedCurrencyName);
    await currencyMasterFormPage.deleteCurrent();

    await currencyMasterListPage.open();
    await currencyMasterListPage.grid.filterByColumnPlaceholder(
      CURRENCY_GRID.currencyNameFilterPlaceholder,
      updatedCurrencyName,
      { listUrlPattern: /\/api\/master\/currencies/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedCurrencyName }),
    ).toHaveCount(0);
  });
});
