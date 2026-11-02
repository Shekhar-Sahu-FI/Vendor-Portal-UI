import { test, expect } from '../../src/fixtures/test.fixture';
import { FINANCIAL_YEAR_GRID } from '../../src/pages/financial-year-master/financial-year-master.constants';
import { buildFinYearData } from '../../src/utils/test-data/master-data';

test.describe('Financial Year Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a financial year', async ({
    financialYearMasterListPage,
    financialYearMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildFinYearData(marker);

    // 1. Create new financial year
    await financialYearMasterListPage.open();
    await financialYearMasterListPage.createNew();
    await financialYearMasterFormPage.fill(data);
    await financialYearMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await financialYearMasterListPage.open();
    await financialYearMasterListPage.grid.filterByColumnPlaceholder(
      FINANCIAL_YEAR_GRID.finYearNameFilterPlaceholder,
      data.finYearName,
      { listUrlPattern: /\/api\/master\/financial-years/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.finYearName);

    // 3. Open and Update
    await financialYearMasterListPage.openSavedRecordForEdit(data.finYearName);
    await expect(page).toHaveURL(/\/financial-year-master\/\d+\/edit/);

    const updatedFinYearName = `FY ${marker.slice(-4)} U`;
    await financialYearMasterFormPage.updateFinYearName(updatedFinYearName);
    await financialYearMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await financialYearMasterListPage.open();
    await financialYearMasterListPage.openSavedRecordForEdit(updatedFinYearName);
    await financialYearMasterFormPage.deleteCurrent();

    await financialYearMasterListPage.open();
    await financialYearMasterListPage.grid.filterByColumnPlaceholder(
      FINANCIAL_YEAR_GRID.finYearNameFilterPlaceholder,
      updatedFinYearName,
      { listUrlPattern: /\/api\/master\/financial-years/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedFinYearName }),
    ).toHaveCount(0);
  });
});
