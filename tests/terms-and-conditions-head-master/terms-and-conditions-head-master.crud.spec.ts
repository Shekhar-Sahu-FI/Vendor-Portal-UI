import { test, expect } from '../../src/fixtures/test.fixture';
import { TERMS_AND_CONDITIONS_HEAD_GRID } from '../../src/pages/terms-and-conditions-head-master/terms-and-conditions-head-master.constants';
import { buildTNCHeadData } from '../../src/utils/test-data/master-data';

test.describe('Terms and Conditions Head Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a T&C head', async ({
    termsAndConditionsHeadMasterListPage,
    termsAndConditionsHeadMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildTNCHeadData(marker);

    // 1. Create new T&C head
    await termsAndConditionsHeadMasterListPage.open();
    await termsAndConditionsHeadMasterListPage.createNew();
    await termsAndConditionsHeadMasterFormPage.fill(data);
    await termsAndConditionsHeadMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await termsAndConditionsHeadMasterListPage.open();
    await termsAndConditionsHeadMasterListPage.grid.filterByColumnPlaceholder(
      TERMS_AND_CONDITIONS_HEAD_GRID.tncHeadNameFilterPlaceholder,
      data.tncHeadName,
      { listUrlPattern: /\/api\/master\/terms-and-condition-heads/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.tncHeadName);

    // 3. Open and Update
    await termsAndConditionsHeadMasterListPage.openSavedRecordForEdit(data.tncHeadName);
    await expect(page).toHaveURL(/\/terms-and-conditions-head-master\/\d+\/edit/);

    const updatedTncHeadName = `TNCH Upd ${marker}`.slice(0, 100);
    await termsAndConditionsHeadMasterFormPage.updateTncHeadName(updatedTncHeadName);
    await termsAndConditionsHeadMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await termsAndConditionsHeadMasterListPage.open();
    await termsAndConditionsHeadMasterListPage.openSavedRecordForEdit(updatedTncHeadName);
    await termsAndConditionsHeadMasterFormPage.deleteCurrent();

    await termsAndConditionsHeadMasterListPage.open();
    await termsAndConditionsHeadMasterListPage.grid.filterByColumnPlaceholder(
      TERMS_AND_CONDITIONS_HEAD_GRID.tncHeadNameFilterPlaceholder,
      updatedTncHeadName,
      { listUrlPattern: /\/api\/master\/terms-and-condition-heads/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedTncHeadName }),
    ).toHaveCount(0);
  });
});
