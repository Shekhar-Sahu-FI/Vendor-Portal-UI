export interface CostCenterFillData {
  alias?: string;
  costCenterName?: string;
  parentCostCenter?: { query: string; value: string };
  companyDivisionIds?: number[];
  status?: string;
  statusRemarks?: string;
}
