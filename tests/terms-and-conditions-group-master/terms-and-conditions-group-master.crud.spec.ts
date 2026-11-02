import { test, expect } from '../../src/fixtures/test.fixture';
import { TERMS_AND_CONDITIONS_GROUP_GRID } from '../../src/pages/terms-and-conditions-group-master/terms-and-conditions-group-master.constants';
import { buildTNCGroupData } from '../../src/utils/test-data/master-data';

test.describe('Terms and Conditions Group Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a T&C group', async ({
    termsAndConditionsGroupMasterListPage,
    termsAndConditionsGroupMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildTNCGroupData(marker);

    // 1. Create new T&C group
    await termsAndConditionsGroupMasterListPage.open();
    await termsAndConditionsGroupMasterListPage.createNew();
    await termsAndConditionsGroupMasterFormPage.fill(data);
    await termsAndConditionsGroupMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await termsAndConditionsGroupMasterListPage.open();
    await termsAndConditionsGroupMasterListPage.grid.filterByColumnPlaceholder(
      TERMS_AND_CONDITIONS_GROUP_GRID.tncGroupNameFilterPlaceholder,
      data.tncGroupName,
      { listUrlPattern: /\/api\/master\/terms-and-condition-groups/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.tncGroupName);

    // 3. Open and Update
    await termsAndConditionsGroupMasterListPage.openSavedRecordForEdit(data.tncGroupName);
    await expect(page).toHaveURL(/\/terms-and-conditions-group-master\/\d+\/edit/);

    const updatedTncGroupName = `TNCG Upd ${marker}`.slice(0, 50);
    await termsAndConditionsGroupMasterFormPage.updateTncGroupName(updatedTncGroupName);
    await termsAndConditionsGroupMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await termsAndConditionsGroupMasterListPage.open();
    await termsAndConditionsGroupMasterListPage.openSavedRecordForEdit(updatedTncGroupName);
    await termsAndConditionsGroupMasterFormPage.deleteCurrent();

    await termsAndConditionsGroupMasterListPage.open();
    await termsAndConditionsGroupMasterListPage.grid.filterByColumnPlaceholder(
      TERMS_AND_CONDITIONS_GROUP_GRID.tncGroupNameFilterPlaceholder,
      updatedTncGroupName,
      { listUrlPattern: /\/api\/master\/terms-and-condition-groups/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedTncGroupName }),
    ).toHaveCount(0);
  });
});
