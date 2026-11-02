import { test, expect } from '../../src/fixtures/test.fixture';
import { GENERAL_DETAIL_LABELS } from '../../src/pages/approval-setup-master/approval-setup-master.constants';
import { asmExpectField, asmExpectUrl } from '../../src/pages/approval-setup-master/approval-setup-master.assert.messages';
import { buildApprovalSetupUpdateData } from '../../src/utils/test-data/approval-setup-master.data';
import { getFieldValue } from '../../src/utils/field-accessor';

test.describe('Approval Setup Master - Update', () => {
  let savedCode = '';

  test.beforeEach(async ({ approvalSetupMasterListPage, approvalSetupMasterFormPage }) => {
    const marker = Date.now().toString();
    const data = buildApprovalSetupUpdateData(marker);

    await approvalSetupMasterListPage.open();
    await approvalSetupMasterListPage.createNew();
    await approvalSetupMasterFormPage.fill(data);
    savedCode = await approvalSetupMasterFormPage.saveAndConfirm();

    await approvalSetupMasterListPage.open();
    await approvalSetupMasterListPage.openSavedRecordForEdit(savedCode);
  });

  test('should update description on an existing approval setup', async ({
    approvalSetupMasterListPage,
    approvalSetupMasterFormPage,
    page,
  }) => {
    const updatedDescription = `Updated approval setup ${Date.now()}`;

    await expect(
      page,
      asmExpectUrl('to open an existing Approval Setup in edit mode before update'),
    ).toHaveURL(/\/approval-setup-master\/\d+\/edit/);

    await approvalSetupMasterFormPage.updateDescription(updatedDescription);

    await approvalSetupMasterListPage.open();
    await approvalSetupMasterListPage.openSavedRecordForEdit(savedCode);

    const description = await getFieldValue(page, GENERAL_DETAIL_LABELS.description);
    expect(
      description,
      asmExpectField(GENERAL_DETAIL_LABELS.description, updatedDescription),
    ).toBe(updatedDescription);
  });
});
