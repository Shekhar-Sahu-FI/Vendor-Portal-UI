export interface CompanyFillData {
  companyName?: string;
  alias?: string;
  printingName?: string;
  headOffice?: { query: string; value: string };
  address1?: string;
  address2?: string;
  address3?: string;
  country?: { query: string; value: string };
  state?: { query: string; value: string };
  city?: { query: string; value: string };
  pincode?: string;
  email?: string;
  website?: string;
  panNo?: string;
  cinNo?: string;
  gstinNo?: string;
  corporateOfficeAddress?: string;
  corporateOfficeEmail?: string;
  regdOfficeAddress?: string;
  regdOfficeEmail?: string;
  timeZone?: { query: string; value: string };
  erpCompanyUniqueId?: string;
  tallyCompanyName?: string;
  tallyGodownName?: string;
  status?: string;
  statusRemarks?: string;
}
