import { expect, Locator, Page } from '@playwright/test';
import path from 'path';
import { attachmentAsset } from './attachment-assets.helper';

export const DEFAULT_ATTACHMENT_TAB = 'Attachments';
export const DEFAULT_ATTACHMENT_FILE = 'sample.pdf';

/** UCDocAttachment root (`uc-doc-attachment.tsx`). */
export const DOC_ATTACHMENT_ROOT = '.flex.flex-col.gap-4.w-full.items-end';

/**
 * Card with underlined tabs (General Detail / Attachments) — not role="tab".
 */
export function attachmentTabsCard(page: Page) {
  return page.locator('div.rounded-lg').filter({
    has: page.getByRole('button', { name: DEFAULT_ATTACHMENT_TAB, exact: true }),
  }).filter({
    has: page.getByRole('button', { name: 'General Detail', exact: true }),
  }).first();
}

/** Tab strip button, e.g. "Attachments". */
export function attachmentTab(page: Page, tabLabel = DEFAULT_ATTACHMENT_TAB) {
  return attachmentTabsCard(page).getByRole('button', { name: tabLabel, exact: true });
}

/** UCDocAttachment block under the active tab (Upload Files + empty state / grid). */
export function attachmentPanel(page: Page) {
  return attachmentTabsCard(page).locator(DOC_ATTACHMENT_ROOT);
}

/** Same UCDocAttachment layout inside a modal (item grid dialog). */
export function attachmentPanelInDialog(page: Page, dialogTitle: string) {
  return page.locator('.z-modal').filter({ has: page.getByText(dialogTitle) }).locator(DOC_ATTACHMENT_ROOT);
}

export async function openAttachmentTab(page: Page, tabLabel = DEFAULT_ATTACHMENT_TAB): Promise<Locator> {
  await attachmentTab(page, tabLabel).click();
  const panel = attachmentPanel(page);
  await expect(panel).toBeVisible({ timeout: 15_000 });
  await expect(panel.getByRole('button', { name: 'Upload Files' })).toBeVisible();
  return panel;
}

export async function expectUploadFilesButton(panel: Locator): Promise<void> {
  await expect(panel.getByRole('button', { name: 'Upload Files' })).toBeVisible();
}

export async function expectNoAttachments(panel: Locator): Promise<void> {
  await expect(panel.getByText('No files attached', { exact: true })).toBeVisible();
}

export function attachmentRow(panel: Locator, fileName: string) {
  return panel.getByRole('row').filter({ hasText: fileName }).first();
}

/**
 * Clicks "Upload Files" (triggers the hidden `input[type="file"]` in the same block).
 */
export async function uploadViaUploadButton(
  panel: Locator,
  page: Page,
  filePath: string,
): Promise<void> {
  const uploadBtn = panel.getByRole('button', { name: 'Upload Files' });
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    uploadBtn.click(),
  ]);
  await fileChooser.setFiles(filePath);
}

/** Template row: "Select File" drop zone per document name. */
export async function uploadViaSelectFile(
  panel: Locator,
  documentName: string,
  filePath: string,
): Promise<void> {
  const row = panel.getByRole('row').filter({ hasText: documentName }).first();
  await row.locator('input[type="file"]').setInputFiles(filePath);
}

export async function waitUntilUploaded(panel: Locator, fileName: string): Promise<void> {
  const row = attachmentRow(panel, fileName);
  await expect(row).toBeVisible({ timeout: 15_000 });
  await expect
    .poll(async () => (await row.textContent()) ?? '', { timeout: 90_000 })
    .toMatch(/Uploaded|Completed/i);
}

export async function expectUploadFailed(panel: Locator, fileName: string): Promise<void> {
  await expect(attachmentRow(panel, fileName)).toContainText(/Failed/i);
}

export async function acceptBrowserAlert(page: Page, message: RegExp | string): Promise<void> {
  const dialog = await page.waitForEvent('dialog', { timeout: 15_000 });
  if (typeof message === 'string') {
    expect(dialog.message()).toContain(message);
  } else {
    expect(dialog.message()).toMatch(message);
  }
  await dialog.accept();
}

export async function removeUploadedFile(panel: Locator, fileName: string): Promise<void> {
  await attachmentRow(panel, fileName).getByRole('button', { name: 'Remove file' }).click();
}

export async function closeAttachmentDialog(page: Page, dialogTitle: string): Promise<void> {
  const modal = page.locator('.z-modal').filter({ has: page.getByText(dialogTitle) });
  await modal.locator('button').first().click();
  await expect(modal).toBeHidden({ timeout: 10_000 });
}

/**
 * Document tab: empty → Upload Files → success → remove → empty.
 */
export async function testDocumentAttachments(
  page: Page,
  options?: { tabLabel?: string; file?: string },
): Promise<void> {
  const tabLabel = options?.tabLabel ?? DEFAULT_ATTACHMENT_TAB;
  const file = options?.file ?? DEFAULT_ATTACHMENT_FILE;
  const fileName = path.basename(file);
  const filePath = attachmentAsset(file);

  const panel = await openAttachmentTab(page, tabLabel);
  await expectNoAttachments(panel);

  await uploadViaUploadButton(panel, page, filePath);
  await waitUntilUploaded(panel, fileName);

  await removeUploadedFile(panel, fileName);
  await expectNoAttachments(panel);
}
