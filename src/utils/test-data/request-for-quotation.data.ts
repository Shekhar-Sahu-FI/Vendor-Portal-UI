import { RequestForQuotationFillData } from '../../types/request-for-quotation.types';
import { RFQ_SOURCE_DOCUMENT_TYPE } from '../../pages/request-for-quotation/request-for-quotation.constants';

const suggest = (query: string, value: string) => ({ query, value });

/** Defaults applied when portal requires make / tech spec on direct item rows. */
export const RFQ_ITEM_PORTAL_DEFAULTS = {
  make: suggest('Larsen', 'Larsen & Toubro'),
  techSpecification: '454',
} as const;

/**
 * RFQ/00092 (id 197) — Purchase Request source, PR SS-PR-0007 line 1.
 */
export const RFQ_PURCHASE_REQUEST_FILL_DATA: RequestForQuotationFillData = {
  company: suggest('Apex', 'Apex Steel Pvt Ltd.'),
  documentType: suggest('RProcess', 'RProcess'),
  documentDate: '2026-06-04',
  documentStatus: { query: 'Draft', value: 'Draft' },
  sourceDocumentTypeId: RFQ_SOURCE_DOCUMENT_TYPE.purchaseRequest,
  sourceDocumentType: { query: 'Purchase Request', value: 'Purchase Request' },
  dueDate: '2026-06-18',
  isPriceList: false,
  contactPersonName: 'Shekhar Sahu',
  contactEmail: 'valupigy@denipl.net',
  mailSubject:
    'Request for quotation of [Automation Servo Controlled Multi Axis Robotic Material Handling Conveyor Integration System with Intelligent PLC Monitoring Interface, High Precision Pneumatic Positioning Unit, Heavy Duty Load Bearing Frame Structure, Advanced Thermal Protection Assembly, Corrosion Resistant Powder Coated Enclosure, Automated Emergency Shutdown Controller, Smart Energy Consumption Optimization Module, Integrated Industrial Safety Interlock Mechanism, Precision Torque Calibration D...]',
  tncGroup: suggest('default RFQ', 'default RFQ'),
  termsNConditionRows: [
    { termsNConditionHead: suggest('UNDERSIZE', 'UNDERSIZE'), value: 'Value 1' },
    { termsNConditionHead: suggest('OTHER CHARGES', 'OTHER CHARGES'), value: 'Value 2' },
    { termsNConditionHead: suggest('REPAIRING CHARGES', 'REPAIRING CHARGES'), value: 'Value 3' },
  ],
  prModalRows: [
    {
      prNo: 'SS-PR-0007',
      lineNo: 1,
      rfqQty: '0.08',
      rfqMake: suggest('Larsen', 'Larsen & Toubro'),
    },
  ],
  vendorRows: [
    {
      vendor: suggest('Shekhar Traders', 'Shekhar Traders'),
      vendorLocation: suggest('Deori', 'Deori 2'),
      contactPerson: suggest('Shekhar', 'Shekhar'),
    },
  ],
};

/**
 * RFQ0017 / Direct source — cold rolled sheets item.
 */
export const RFQ_DIRECT_FILL_DATA: RequestForQuotationFillData = {
  documentType: suggest('RProcess', 'RProcess'),
  documentDate: '2026-06-03',
  documentStatus: { query: 'Draft', value: 'Draft' },
  sourceDocumentTypeId: RFQ_SOURCE_DOCUMENT_TYPE.direct,
  sourceDocumentType: { query: 'Direct', value: 'Direct' },
  dueDate: '2026-09-09',
  isPriceList: false,
  contactPersonName: 'string',
  contactEmail: 'string@gmail.com',
  remarks: 'string',
  mailSubject: 'Request for quotation of cold rolled sheets',
  itemRows: [
    {
      item: suggest('cold rolled', 'cold rolled sheets'),
      make: suggest('Larsen', 'Larsen & Toubro'),
      unit: suggest('METRIC', 'METRIC TON'),
      techSpecification: 'sdf',
      qty: '16',
      remarks: 'string',
    },
  ],
  vendorRows: [
    {
      vendor: suggest('Force Intellect', 'Force Intellect Private limited'),
      vendorLocation: suggest('Room No', 'Room No. 6 STPI Nehru Nagar'),
      contactPerson: suggest('Khilesh', 'Khilesh'),
    },
  ],
};
