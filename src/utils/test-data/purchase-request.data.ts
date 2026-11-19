import { PurchaseRequestFillData } from '../../types/purchase-request.types';

const suggest = (query: string, value: string, code?: string) => ({ query, value, code });

/** Hardcoded PR used for save-then-verify-on-edit tests. */
export function buildPurchaseRequestVerifyData(uniqueMarker: string): PurchaseRequestFillData {
  return {
    company: suggest('Company One', 'Company One', 'CONE'),
    division: suggest('Division One', 'Division One Company One Two Three', 'DIVONE'),
    documentType: suggest('PR - Standard', 'PR - Standard - Division One Company One Two Three', 'PST'),
    documentDate: '2026-06-15',
    department: suggest('Department One', 'Department One Division One Two Three'),
    requestedBy: suggest('UN2', 'Rajesh Verma'),
    requestedContactNo: { countrySearch: 'India', localNumber: '9876500002' },
    requestedByEmail: 'rajesh.verma@shaktiindustrial.com',
    expenditureType: 'Capex',
    referenceNo: `REF-${uniqueMarker}`,
    referenceDate: '2026-06-10',
    remarks: `PR saved data verify ${uniqueMarker}`,
    itemRows: [
      {
        item: suggest('Item One', 'Item One No Multi Unit No Make'),
        requiredQty: '100',
        prQty: '100',
        rate: '1',
        remarks: 'Item One remarks',
        techSpecification: 'Technical specification for Item One',
        scheduleDate: '2026-10-28',
        priority: suggest('Priority One', 'Priority One'),
        costCenter: suggest('Cost Center One', 'Cost Center One', 'CCONE'),
      },
    ],
    informToRows: [
      suggest('UN1', 'System Administrator'),
      suggest('UN3', 'Sanjay Kulkarni'),
    ],
  };
}
