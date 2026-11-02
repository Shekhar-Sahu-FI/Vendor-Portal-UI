import { test, expect } from '../../src/fixtures/test.fixture';
import { APPROVAL_SETUP_MASTER_GRID } from '../../src/pages/approval-setup-master/approval-setup-master.constants';
import { asmExpectField, asmExpectUrl } from '../../src/pages/approval-setup-master/approval-setup-master.assert.messages';
import { buildApprovalSetupSaveData } from '../../src/utils/test-data/approval-setup-master.data';

test.describe('Approval Setup Master - Delete', () => {
  test('should delete a draft approval setup', async ({
    approvalSetupMasterListPage,
    approvalSetupMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildApprovalSetupSaveData(marker);

    await approvalSetupMasterListPage.open();
    await approvalSetupMasterListPage.createNew();
    await approvalSetupMasterFormPage.fill(data);
    const code = await approvalSetupMasterFormPage.saveAndConfirm();

    await approvalSetupMasterListPage.open();
    await approvalSetupMasterListPage.openSavedRecordForEdit(code);

    await expect(
      page,
      asmExpectUrl('to open the Approval Setup in edit mode before delete'),
    ).toHaveURL(/\/approval-setup-master\/\d+\/edit/);

    await approvalSetupMasterFormPage.deleteCurrent('Automated test cleanup');

    await approvalSetupMasterListPage.open();
    await approvalSetupMasterListPage.grid.filterByColumnPlaceholder(
      APPROVAL_SETUP_MASTER_GRID.codeFilterPlaceholder,
      code,
      { listUrlPattern: /approval-setups/i },
    );

    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: code }),
      asmExpectField(APPROVAL_SETUP_MASTER_GRID.codeColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
