export interface VendorRegistrationFillData {
  vendorName?: string;
  legalName?: string;
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
  contactPersonName?: string;
  contactPersonDesignation?: string;
  contactPersonEmail?: string;
  contactNo?: string;
  bankName?: string;
  branchName?: string;
  accountNo?: string;
  ifscCode?: string;
}
