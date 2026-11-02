import { RequestForQuotationFillData } from '../../types/request-for-quotation.types';
import { RfqPortalSettings } from '../portal-settings.helper';
import {
  RFQ_DIRECT_FILL_DATA,
  RFQ_ITEM_PORTAL_DEFAULTS,
  RFQ_PURCHASE_REQUEST_FILL_DATA,
} from './request-for-quotation.data';

function cloneFillData(data: RequestForQuotationFillData): RequestForQuotationFillData {
  return structuredClone(data);
}

export function buildPurchaseRequestRfqData(): RequestForQuotationFillData {
  return cloneFillData(RFQ_PURCHASE_REQUEST_FILL_DATA);
}

export function buildDirectRfqData(): RequestForQuotationFillData {
  return cloneFillData(RFQ_DIRECT_FILL_DATA);
}

export function applyRfqPortalItemDefaults(
  rows: NonNullable<RequestForQuotationFillData['itemRows']>,
  portalSettings: RfqPortalSettings,
): NonNullable<RequestForQuotationFillData['itemRows']> {
  return rows.map((row) => ({
    ...row,
    make:
      row.make
      ?? (portalSettings.isRfqItemMakeRequired ? RFQ_ITEM_PORTAL_DEFAULTS.make : undefined),
    techSpecification:
      row.techSpecification
      ?? (portalSettings.isRfqItemTechSpecRequired
        ? RFQ_ITEM_PORTAL_DEFAULTS.techSpecification
        : undefined),
  }));
}
