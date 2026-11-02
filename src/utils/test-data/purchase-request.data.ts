import { PurchaseRequestFillData } from '../../types/purchase-request.types';

const suggest = (query: string, value: string) => ({ query, value });

/** Hardcoded PR used for save-then-verify-on-edit tests. */
export function buildPurchaseRequestVerifyData(uniqueMarker: string): PurchaseRequestFillData {
  return {
    company: suggest('bsp', 'BSP'),
    division: suggest('Plant', 'Plant Division'),
    documentType: suggest('Process', 'Process'),
    documentDate: '2026-05-06',
    department: suggest('Purchase', 'Purchase'),
    requestedBy: suggest('sai', 'sai-ui'),
    requestedContactNo: { countrySearch: 'India', localNumber: '9876543210' },
    expenditureType: 'Capex',
    referenceNo: `PR/BSP/PLT/PRC/${uniqueMarker}`,
    referenceDate: '2026-04-17',
    remarks: `PR saved data verify ${uniqueMarker}`,
    itemRows: [
      {
        item: suggest('I-beams', 'I-beams'),
        requiredQty: '100',
        prQty: '100',
        rate: '1',
        remarks: 'BEam shaping',
        techSpecification: 'I-beams are used for construction of buildings and bridges',
        scheduleDate: '2026-10-28',
        priority: suggest('high', 'Very High'),
        costCenter: suggest('Machine', 'Machine Operations'),
      },
    ],
    informToRows: [
      suggest('sai', 'sai ui'),
      suggest('Bhargav', 'Bhargav'),
    ],
  };
}
