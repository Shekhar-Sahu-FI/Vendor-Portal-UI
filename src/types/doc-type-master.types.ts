export interface DocTypeFillData {
  docTypeName?: string;
  docTypeAlias?: string;
  form?: { query: string; value: string };
  companyDivisionIds?: (string | number)[];
  status?: string;
  statusRemarks?: string;
}
