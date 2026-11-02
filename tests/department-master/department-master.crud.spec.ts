import { test, expect } from '../../src/fixtures/test.fixture';
import { DEPARTMENT_GRID } from '../../src/pages/department-master/department-master.constants';
import { departmentExpectField, departmentExpectUrl } from '../../src/pages/department-master/department-master.assert.messages';
import { buildDepartmentData } from '../../src/utils/test-data/master-data';

test.describe('Department Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete a department', async ({
    departmentMasterListPage,
    departmentMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildDepartmentData(marker);

    // 1. Create new department
    await departmentMasterListPage.open();
    await departmentMasterListPage.createNew();
    await departmentMasterFormPage.fill(data);
    const code = await departmentMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await departmentMasterListPage.open();
    await departmentMasterListPage.grid.filterByColumnPlaceholder(
      DEPARTMENT_GRID.departmentNameFilterPlaceholder,
      data.departmentName,
      { listUrlPattern: /\/api\/master\/departments/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      departmentExpectField(DEPARTMENT_GRID.departmentNameColumn, data.departmentName),
    ).toContainText(data.departmentName);

    // 3. Open and Update
    await departmentMasterListPage.openSavedRecordForEdit(data.departmentName);
    await expect(
      page,
      departmentExpectUrl('to open Department in edit mode'),
    ).toHaveURL(/\/department-master\/\d+\/edit/);

    const updatedDeptName = `Updated Dept ${marker}`.slice(0, 100);
    await departmentMasterFormPage.updateDepartmentName(updatedDeptName);

    // 4. Delete & Verify removal
    await departmentMasterListPage.open();
    await departmentMasterListPage.openSavedRecordForEdit(updatedDeptName);
    await departmentMasterFormPage.deleteCurrent('Automated cleanup');

    await departmentMasterListPage.open();
    await departmentMasterListPage.grid.filterByColumnPlaceholder(
      DEPARTMENT_GRID.departmentNameFilterPlaceholder,
      updatedDeptName,
      { listUrlPattern: /\/api\/master\/departments/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedDeptName }),
      departmentExpectField(DEPARTMENT_GRID.departmentNameColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
