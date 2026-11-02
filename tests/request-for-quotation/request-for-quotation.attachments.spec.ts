import { test } from '../../src/fixtures/test.fixture';
import { attachmentTab, testDocumentAttachments } from '../../src/utils/attachment.helper';

test.describe('Request for Quotation - Attachments', () => {
  test('upload and remove file on Attachments tab', async ({
    requestForQuotationListPage,
    requestForQuotationFormPage,
    page,
  }) => {
    await requestForQuotationListPage.open();
    await requestForQuotationListPage.createNew();
    await requestForQuotationFormPage.openNew();
    await requestForQuotationFormPage.fillSourceDocumentDirect();

    if (!(await attachmentTab(page).isVisible().catch(() => false))) {
      test.skip(true, 'Attachments tab not enabled for this portal');
    }

    await testDocumentAttachments(page, { tabLabel: 'Attachments' });
  });

  test('upload file from item grid attachment cell', async ({
    requestForQuotationListPage,
    requestForQuotationFormPage,
    page,
  }) => {
    await requestForQuotationListPage.open();
    await requestForQuotationListPage.createNew();
    await requestForQuotationFormPage.openNew();
    await requestForQuotationFormPage.fillSourceDocumentDirect();
    await requestForQuotationFormPage.itemDetail.fillRow(0, {
      item: { query: 'cold', value: 'cold rolled sheets' },
    });

    const attachmentCell = page.locator('[data-cell-id="cell-0-attachment"]');
    if (!(await attachmentCell.isVisible().catch(() => false))) {
      test.skip(true, 'Item attachment column not enabled for this portal');
    }

    await requestForQuotationFormPage.itemDetail.uploadAttachment(0);
  });
});
