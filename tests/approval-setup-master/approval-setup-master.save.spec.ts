import { test, expect } from '../../src/fixtures/test.fixture';
import { APPROVAL_SETUP_MASTER_GRID } from '../../src/pages/approval-setup-master/approval-setup-master.constants';
import { asmExpectField } from '../../src/pages/approval-setup-master/approval-setup-master.assert.messages';
import { buildApprovalSetupSaveData } from '../../src/utils/test-data/approval-setup-master.data';

test.describe('Approval Setup Master - Save', () => {
  test('should create a new approval setup for Approval Setup Master', async ({
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
    await approvalSetupMasterListPage.grid.filterByColumnPlaceholder(
      APPROVAL_SETUP_MASTER_GRID.codeFilterPlaceholder,
      code,
      { listUrlPattern: /approval-setups/i },
    );

    await expect(
      page.locator('.search-data-grid tbody tr').first(),
      asmExpectField(APPROVAL_SETUP_MASTER_GRID.codeColumn, code),
    ).toContainText(code);
    await expect(
      page.locator('.search-data-grid tbody tr').first(),
      asmExpectField(APPROVAL_SETUP_MASTER_GRID.nameColumn, data.approvalSetupName!),
    ).toContainText(data.approvalSetupName!);
  });
});
