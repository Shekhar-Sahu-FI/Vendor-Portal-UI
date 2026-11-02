import { test, expect } from '../../src/fixtures/test.fixture';
import { VENDOR_ATTACHMENT_GRID } from '../../src/pages/vendor-attachment-master/vendor-attachment-master.constants';
import { buildVendorAttachmentData } from '../../src/utils/test-data/master-data';

test.describe('Vendor Attachment Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a vendor attachment', async ({
    vendorAttachmentMasterListPage,
    vendorAttachmentMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildVendorAttachmentData(marker);

    // 1. Create new vendor attachment
    await vendorAttachmentMasterListPage.open();
    await vendorAttachmentMasterListPage.createNew();
    await vendorAttachmentMasterFormPage.fill(data);
    await vendorAttachmentMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await vendorAttachmentMasterListPage.open();
    await vendorAttachmentMasterListPage.grid.filterByColumnPlaceholder(
      VENDOR_ATTACHMENT_GRID.documentNameFilterPlaceholder,
      data.documentName,
      { listUrlPattern: /\/api\/master\/vendor-attachments/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(firstRow).toContainText(data.documentName);

    // 3. Open and Update
    await vendorAttachmentMasterListPage.openSavedRecordForEdit(data.documentName);
    await expect(page).toHaveURL(/\/vendor-attachment-master\/\d+\/edit/);

    const updatedDocumentName = `VAtt Upd ${marker}`.slice(0, 150);
    await vendorAttachmentMasterFormPage.updateDocumentName(updatedDocumentName);
    await vendorAttachmentMasterFormPage.saveAndConfirm();

    // 4. Delete & Verify removal
    await vendorAttachmentMasterListPage.open();
    await vendorAttachmentMasterListPage.openSavedRecordForEdit(updatedDocumentName);
    await vendorAttachmentMasterFormPage.deleteCurrent();

    await vendorAttachmentMasterListPage.open();
    await vendorAttachmentMasterListPage.grid.filterByColumnPlaceholder(
      VENDOR_ATTACHMENT_GRID.documentNameFilterPlaceholder,
      updatedDocumentName,
      { listUrlPattern: /\/api\/master\/vendor-attachments/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedDocumentName }),
    ).toHaveCount(0);
  });
});
