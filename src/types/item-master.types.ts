/** Auto-suggestion field: type query, select value */
export interface AutoSuggestField {
  query: string;
  value: string;
}

export interface ItemMasterMakeRowData {
  makeAlias?: AutoSuggestField;
  makeName?: AutoSuggestField;
}

export interface ItemMasterUnitConversionRowData {
  unitType?: string;
  conversionType?: string;
  fromUnitValue?: string;
  toUnit?: AutoSuggestField;
  toUnitValue?: string;
}

/**
 * Flat fill payload for Item Master form.
 * Only provided fields are filled.
 */
export interface ItemMasterFillData {
  subgroup?: AutoSuggestField;
  itemName?: string;
  stockUnit?: AutoSuggestField;
  gstCategory?: string;
  hsnSacCode?: string;
  remarks?: string;
  makeMgmtType?: string;
  makeRows?: ItemMasterMakeRowData[];
  isMultipleUnitApplicable?: boolean;
  unitConversionRows?: ItemMasterUnitConversionRowData[];
  status?: string;
  statusRemarks?: string;
}
