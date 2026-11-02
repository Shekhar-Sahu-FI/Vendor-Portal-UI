import { test, expect } from '../../src/fixtures/test.fixture';
import { BUSINESS_TYPE_GRID } from '../../src/pages/business-type-master/business-type-master.constants';
import { buildBusinessTypeData } from '../../src/utils/test-data/master-data';

test.describe('Business Type Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a business type', async ({
    businessTypeMasterListPage,
    businessTypeMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildBusinessTypeData(marker);

    // 1. Create new business type
    await businessTypeMasterListPage.open();
    await businessTypeMasterListPage.createNew();
    await businessTypeMasterFormPage.fill(data);
    await businessTypeMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await businessTypeMasterListPage.open();
    await businessTypeMasterListPage.grid.filterByColumnPlaceholder(
      BUSINESS_TYPE_GRID.businessTypeNameFilterPlaceholder,
      data.businessTypeName,
      { listUrlPattern: /\/api\/master\/businessTypes/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.businessTypeName);

    // 3. Open and Update
    await businessTypeMasterListPage.openSavedRecordForEdit(data.businessTypeName);
    await expect(page).toHaveURL(/\/business-type-master\/\d+\/edit/);

    const updatedBusinessTypeName = `BizType Upd ${marker}`.slice(0, 100);
    await businessTypeMasterFormPage.updateBusinessTypeName(updatedBusinessTypeName);
    await businessTypeMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await businessTypeMasterListPage.open();
    await businessTypeMasterListPage.openSavedRecordForEdit(updatedBusinessTypeName);
    await businessTypeMasterFormPage.deleteCurrent();

    await businessTypeMasterListPage.open();
    await businessTypeMasterListPage.grid.filterByColumnPlaceholder(
      BUSINESS_TYPE_GRID.businessTypeNameFilterPlaceholder,
      updatedBusinessTypeName,
      { listUrlPattern: /\/api\/master\/businessTypes/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedBusinessTypeName }),
    ).toHaveCount(0);
  });
});
