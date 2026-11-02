export interface CompanyLocationFillData {
  company?: { query: string; value: string };
  address1?: string;
  address2?: string;
  address3?: string;
  country?: { query: string; value: string };
  state?: { query: string; value: string };
  city?: { query: string; value: string };
  pincode?: string;
  contactNo?: string;
  isDefault?: boolean;
  erpLocationUniqueId1?: string;
  erpLocationUniqueId2?: string;
  status?: string;
  statusRemarks?: string;
}
