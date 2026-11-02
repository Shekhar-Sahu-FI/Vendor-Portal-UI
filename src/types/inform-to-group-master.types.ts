export interface InformToGroupUserRow {
  userName: { query: string; value: string };
  email?: string;
  contactNo?: string;
}

export interface InformToGroupFillData {
  informToGroupName?: string;
  description?: string;
  users?: InformToGroupUserRow[];
  status?: string;
  statusRemarks?: string;
}
