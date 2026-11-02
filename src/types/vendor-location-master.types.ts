export interface VendorLocationFillData {
  vendor?: { query: string; value: string };
  locationName?: string;
  address1?: string;
  address2?: string;
  address3?: string;
  country?: { query: string; value: string };
  state?: { query: string; value: string };
  city?: { query: string; value: string };
  pincode?: string;
  contactNo?: string;
  status?: string;
  statusRemarks?: string;
}
