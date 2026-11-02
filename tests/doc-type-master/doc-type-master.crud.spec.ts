import { test, expect } from '../../src/fixtures/test.fixture';
import { DOC_TYPE_GRID } from '../../src/pages/doc-type-master/doc-type-master.constants';
import { docTypeExpectField, docTypeExpectUrl } from '../../src/pages/doc-type-master/doc-type-master.assert.messages';
import { buildDocTypeData } from '../../src/utils/test-data/master-data';

test.describe('Doc Type Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a doc type', async ({
    docTypeMasterListPage,
    docTypeMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildDocTypeData(marker);

    // 1. Create new doc type
    await docTypeMasterListPage.open();
    await docTypeMasterListPage.createNew();
    await docTypeMasterFormPage.fill(data);
    const code = await docTypeMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await docTypeMasterListPage.open();
    await docTypeMasterListPage.grid.filterByColumnPlaceholder(
      DOC_TYPE_GRID.docTypeNameFilterPlaceholder,
      data.docTypeName,
      { listUrlPattern: /\/api\/master\/doc-types/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      docTypeExpectField(DOC_TYPE_GRID.docTypeNameColumn, data.docTypeName),
    ).toContainText(data.docTypeName);

    // 3. Open and Update
    await docTypeMasterListPage.openSavedRecordForEdit(data.docTypeName);
    await expect(
      page,
      docTypeExpectUrl('to open Doc Type in edit mode'),
    ).toHaveURL(/\/doc-type-master\/\d+\/edit/);

    const updatedDocTypeName = `Updated DocType ${marker}`.slice(0, 100);
    await docTypeMasterFormPage.updateDocTypeName(updatedDocTypeName);

    // 4. Delete & Verify removal
    await docTypeMasterListPage.open();
    await docTypeMasterListPage.openSavedRecordForEdit(updatedDocTypeName);
    await docTypeMasterFormPage.deleteCurrent('Automated cleanup');

    await docTypeMasterListPage.open();
    await docTypeMasterListPage.grid.filterByColumnPlaceholder(
      DOC_TYPE_GRID.docTypeNameFilterPlaceholder,
      updatedDocTypeName,
      { listUrlPattern: /\/api\/master\/doc-types/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedDocTypeName }),
      docTypeExpectField(DOC_TYPE_GRID.docTypeNameColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
