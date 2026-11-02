import { test, expect } from '../../src/fixtures/test.fixture';
import { COST_CENTER_GRID } from '../../src/pages/cost-center-master/cost-center-master.constants';
import { buildCostCenterData } from '../../src/utils/test-data/master-data';

test.describe('Cost Center Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a cost center', async ({
    costCenterMasterListPage,
    costCenterMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildCostCenterData(marker);

    // 1. Create new cost center
    await costCenterMasterListPage.open();
    await costCenterMasterListPage.createNew();
    await costCenterMasterFormPage.fill(data);
    await costCenterMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await costCenterMasterListPage.open();
    await costCenterMasterListPage.grid.filterByColumnPlaceholder(
      COST_CENTER_GRID.costCenterNameFilterPlaceholder,
      data.costCenterName,
      { listUrlPattern: /\/api\/cost-centers/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.costCenterName);

    // 3. Open and Update
    await costCenterMasterListPage.openSavedRecordForEdit(data.costCenterName);
    await expect(page).toHaveURL(/\/cost-center-master\/\d+\/edit/);

    const updatedCostCenterName = `CC Upd ${marker}`.slice(0, 100);
    await costCenterMasterFormPage.updateCostCenterName(updatedCostCenterName);
    await costCenterMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await costCenterMasterListPage.open();
    await costCenterMasterListPage.openSavedRecordForEdit(updatedCostCenterName);
    await costCenterMasterFormPage.deleteCurrent();

    await costCenterMasterListPage.open();
    await costCenterMasterListPage.grid.filterByColumnPlaceholder(
      COST_CENTER_GRID.costCenterNameFilterPlaceholder,
      updatedCostCenterName,
      { listUrlPattern: /\/api\/cost-centers/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedCostCenterName }),
    ).toHaveCount(0);
  });
});
