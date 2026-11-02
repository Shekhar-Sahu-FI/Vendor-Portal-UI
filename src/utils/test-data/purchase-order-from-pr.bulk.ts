import { PurchaseOrderFillData } from '../../types/purchase-order.types';

/** PRs with 10,000 qty each — used for bulk PO creation (30 qty per PO). */
export const BULK_PR_NUMBERS = ['SS-PR-0005', 'SS-PR-0006', 'SS-PR-0007'] as const;

export const BULK_PO_QTY = '30';

const parsedRunsPerPr = Number(process.env.PO_BULK_RUNS_PER_PR ?? 30);
export const BULK_RUNS_PER_PR =
  Number.isFinite(parsedRunsPerPr) && parsedRunsPerPr > 0 ? parsedRunsPerPr : 30;

export const BULK_TOTAL_RUNS = BULK_PR_NUMBERS.length * BULK_RUNS_PER_PR;

export type BulkPoRunCase = {
  runIndex: number;
  prNo: (typeof BULK_PR_NUMBERS)[number];
  iteration: number;
};

/**
 * Ordered cases: 30× SS-PR-0004, then 30× SS-PR-0005, then 30× SS-PR-0006.
 */
export function buildBulkPoRunCases(): BulkPoRunCase[] {
  const cases: BulkPoRunCase[] = [];
  let runIndex = 0;

  for (const prNo of BULK_PR_NUMBERS) {
    for (let iteration = 1; iteration <= BULK_RUNS_PER_PR; iteration++) {
      runIndex += 1;
      cases.push({ runIndex, prNo, iteration });
    }
  }

  return cases;
}

/**
 * Shared PO form defaults (same as purchase-order.save.spec baseData).
 */
export const bulkPoBaseData: PurchaseOrderFillData = {
  company: { query: 'Bhilai', value: 'Bhilai Steel Plant' },
  division: { query: 'Plant', value: 'Plant Division' },
  documentType: { query: 'Urgent', value: 'Urgent' },
  expenditureType: { query: 'Capex', value: 'Capex' },
  documentStatus: { query: 'Draft', value: 'Draft' },
  validityDate: '2026-12-30',
  vendor: { query: 'Shekhar', value: 'Shekhar Enterprise' },
  vehicleType: { query: 'Truck', value: 'Truck' },
  paymentMode: { query: 'Bank', value: 'Bank Transfer' },
  dueBasis: { query: 'Gate', value: 'Gate Entry' },
  dueDays: 2,
  freightType: { query: 'TOPAY', value: 'TOPAY' },
  freightRateType: { query: 'Fixed', value: 'Fixed' },
  freightAmount: 23,
  priority: { query: 'Priority', value: 'Priority 01' },
  fromLocation: { query: 'Mumbai', value: 'Mumbai' },
  toLocation: { query: 'Mumbai', value: 'Mumbai' },
  currency: { query: 'United', value: 'United States dollar' },
  exchangeRate: 1,
  approvalSetup: { query: 'Shekhar', value: 'Shekhar PO' },
  remarks: 'Remarks',
};

/**
 * Builds fill payload for one PO against a given PR (line 1, configurable qty).
 */
export function buildPurchaseOrderFromPrData(
  prNo: (typeof BULK_PR_NUMBERS)[number],
  poQty: string = BULK_PO_QTY,
): PurchaseOrderFillData {
  return {
    ...bulkPoBaseData,
    referenceDocumentType: { query: 'Purchase Request', value: 'Purchase Request' },
    prModalRows: [
      {
        prNo,
        lineNo: 1,
        poQty,
      },
    ],
    itemRows: [
      {
        rate: 856,
      },
    ],
  };
}
