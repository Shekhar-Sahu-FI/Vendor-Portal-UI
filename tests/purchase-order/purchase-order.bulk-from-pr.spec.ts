import { test } from '../../src/fixtures/test.fixture';
import {
  createPurchaseOrderFromPrWithRecovery,
  recoverToPurchaseOrderList,
} from '../../src/flows/purchase-order-from-pr.flow';
import {
  BULK_PO_QTY,
  BULK_RUNS_PER_PR,
  BULK_TOTAL_RUNS,
  buildBulkPoRunCases,
  buildPurchaseOrderFromPrData,
} from '../../src/utils/test-data/purchase-order-from-pr.bulk';

/**
 * One test, one browser — each PO is a test.step in the report.
 * Failed steps recover to the search list (and retry once inside the flow).
 *
 * Run: npm run test:po:bulk-pr
 */
test.describe('Purchase Order - Bulk from PR', () => {
  test(`creates ${BULK_TOTAL_RUNS} POs from PR (${BULK_RUNS_PER_PR} per PR, qty ${BULK_PO_QTY} each)`, async ({
    purchaseOrderListPage,
    purchaseOrderFormPage,
    page,
  }) => {
    test.setTimeout(Math.max(BULK_TOTAL_RUNS * 8 * 60 * 1000, 60 * 60 * 1000));

    for (const { runIndex, prNo, iteration } of buildBulkPoRunCases()) {
      await test.step(
        `PO ${runIndex}/${BULK_TOTAL_RUNS} — ${prNo} line 1 qty ${BULK_PO_QTY} (${iteration}/${BULK_RUNS_PER_PR})`,
        async () => {
          const data = buildPurchaseOrderFromPrData(prNo, BULK_PO_QTY);
          try {
            await createPurchaseOrderFromPrWithRecovery(
              purchaseOrderListPage,
              purchaseOrderFormPage,
              page,
              data,
            );
          } finally {
            await recoverToPurchaseOrderList(purchaseOrderListPage, page);
          }
        },
      );
    }
  });
});
