export type SuggestionLookup = {
  query: string;
  value: string;
};

export interface AnnouncementFillData {
  type?: string;
  displayTo?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  bannerSize?: string;
  scrollSpeed?: number;
  fontColor?: string;
  backgroundColor?: string;
  displayInAllPage?: boolean;
  status?: string;
  statusRemarks?: string;
}
