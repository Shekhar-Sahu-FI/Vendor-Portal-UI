import { expect, Page } from '@playwright/test';
import { PurchaseOrderFormPage } from '../pages/purchase-order/purchase-order-form.page';
import { PurchaseOrderListPage } from '../pages/purchase-order/purchase-order-list.page';
import { PURCHASE_ORDER_ROUTES } from '../pages/purchase-order/purchase-order.constants';
import { PurchaseOrderFillData } from '../types/purchase-order.types';

const listUrlPattern = new RegExp(
  `${PURCHASE_ORDER_ROUTES.list().replace(/\//g, '\\/')}(\\?.*)?$`,
);

/**
 * Returns the browser to the PO search list (dismisses dialogs/modals first).
 */
export async function recoverToPurchaseOrderList(
  listPage: PurchaseOrderListPage,
  page: Page,
): Promise<void> {
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Escape').catch(() => {});
  }

  const alert = page.locator('.z-alert-box').last();
  if (await alert.isVisible().catch(() => false)) {
    const cancel = alert.getByRole('button', { name: /^Cancel$/i });
    if (await cancel.isVisible().catch(() => false)) {
      await cancel.click().catch(() => {});
    } else {
      await alert.getByRole('button', { name: /^Ok$/i }).click().catch(() => {});
    }
    await alert.waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => {});
  }

  const cancelForm = page.getByRole('button', { name: 'Cancel' });
  if (await cancelForm.isVisible().catch(() => false)) {
    await cancelForm.click().catch(() => {});
  }

  await listPage.open();
}

/**
 * Creates one PO from PR data. On failure, recovers to list and retries once.
 */
export async function createPurchaseOrderFromPrWithRecovery(
  listPage: PurchaseOrderListPage,
  formPage: PurchaseOrderFormPage,
  page: Page,
  data: PurchaseOrderFillData,
): Promise<void> {
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await listPage.open();
      await listPage.createNew();
      await formPage.fill(data);
      await formPage.saveAndConfirm();
      await expect(page).toHaveURL(listUrlPattern, { timeout: 30_000 });
      return;
    } catch (error) {
      console.warn(`[bulk-po] Attempt ${attempt}/${maxAttempts} failed — recovering to list`, error);
      await recoverToPurchaseOrderList(listPage, page);
      if (attempt === maxAttempts) {
        throw error;
      }
    }
  }
}
