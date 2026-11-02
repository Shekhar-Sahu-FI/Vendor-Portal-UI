import { test, expect } from '../../src/fixtures/test.fixture';
import { ANNOUNCEMENT_GRID } from '../../src/pages/announcement-master/announcement-master.constants';
import { announcementExpectField, announcementExpectUrl } from '../../src/pages/announcement-master/announcement-master.assert.messages';
import { buildAnnouncementData } from '../../src/utils/test-data/master-data';

test.describe('Announcement Master - CRUD Lifecycle', () => {
  test('should create, read, update, and delete an announcement', async ({
    announcementMasterListPage,
    announcementMasterFormPage,
    page,
  }) => {
    const marker = Date.now().toString();
    const data = buildAnnouncementData(marker);

    // 1. Create new record
    await announcementMasterListPage.open();
    await announcementMasterListPage.createNew();
    await announcementMasterFormPage.fill(data);
    const code = await announcementMasterFormPage.saveAndConfirm();

    // 2. Read / Verify in grid
    await announcementMasterListPage.open();
    await announcementMasterListPage.grid.filterByColumnPlaceholder(
      ANNOUNCEMENT_GRID.titleFilterPlaceholder,
      data.title,
      { listUrlPattern: /\/api\/master\/announcement/i },
    );

    const firstRow = page.locator('.search-data-grid tbody tr').first();
    await expect(
      firstRow,
      announcementExpectField(ANNOUNCEMENT_GRID.titleColumn, data.title),
    ).toContainText(data.title);

    // 3. Open and Update
    await announcementMasterListPage.openSavedRecordForEdit(data.title);
    await expect(
      page,
      announcementExpectUrl('to open Announcement in edit mode'),
    ).toHaveURL(/\/announcement-master\/\d+\/edit/);

    const updatedTitle = `Updated Announcement ${marker}`;
    await announcementMasterFormPage.updateTitle(updatedTitle);

    // Verify updated title in list
    await announcementMasterListPage.open();
    await announcementMasterListPage.grid.filterByColumnPlaceholder(
      ANNOUNCEMENT_GRID.titleFilterPlaceholder,
      updatedTitle,
      { listUrlPattern: /\/api\/master\/announcement/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').first(),
      announcementExpectField(ANNOUNCEMENT_GRID.titleColumn, updatedTitle),
    ).toContainText(updatedTitle);

    // 4. Delete & Verify removal
    await announcementMasterListPage.openSavedRecordForEdit(updatedTitle);
    await announcementMasterFormPage.deleteCurrent('Automated cleanup');

    await announcementMasterListPage.open();
    await announcementMasterListPage.grid.filterByColumnPlaceholder(
      ANNOUNCEMENT_GRID.titleFilterPlaceholder,
      updatedTitle,
      { listUrlPattern: /\/api\/master\/announcement/i },
    );
    await expect(
      page.locator('.search-data-grid tbody tr').filter({ hasText: updatedTitle }),
      announcementExpectField(ANNOUNCEMENT_GRID.titleColumn, 'not visible after delete'),
    ).toHaveCount(0);
  });
});
