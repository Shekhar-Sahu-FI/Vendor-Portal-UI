import { test, expect } from '../../src/fixtures/test.fixture';
import { COMPANY_GRID } from '../../src/pages/company-master/company-master.constants';
import { companyExpectField, companyExpectUrl } from '../../src/pages/company-master/company-master.assert.messages';
import { buildCompanyData } from '../../src/utils/test-data/master-data';

test.describe('Company Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a company', async ({
    companyMasterListPage,
    companyMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildCompanyData(marker);

    // 1. Create new company
    await companyMasterListPage.open();
    await companyMasterListPage.createNew();
    await companyMasterFormPage.fill(data);
    const code = await companyMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await companyMasterListPage.open();
    await companyMasterListPage.grid.filterByColumnPlaceholder(
      COMPANY_GRID.companyNameFilterPlaceholder,
      data.companyName,
      { listUrlPattern: /\/api\/master\/companies/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      companyExpectField(COMPANY_GRID.companyNameColumn, data.companyName),
    ).toContainText(data.companyName);

    // 3. Open and Update
    await companyMasterListPage.openSavedRecordForEdit(data.companyName);
    await expect(
      page,
      companyExpectUrl('to open Company in edit mode'),
    ).toHaveURL(/\/company-master\/\d+\/edit/);

    const updatedPrintingName = `Updated Print ${marker}`.slice(0, 100);
    await companyMasterFormPage.updatePrintingName(updatedPrintingName);

    // 4. Delete & Verify removal
    await companyMasterListPage.open();
    await companyMasterListPage.openSavedRecordForEdit(data.companyName);
    await companyMasterFormPage.deleteCurrent('Automated cleanup');

    await companyMasterListPage.open();
    await companyMasterListPage.grid.filterByColumnPlaceholder(
      COMPANY_GRID.companyNameFilterPlaceholder,
      data.companyName,
      { listUrlPattern: /\/api\/master\/companies/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: data.companyName }),
      companyExpectField(COMPANY_GRID.companyNameColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
