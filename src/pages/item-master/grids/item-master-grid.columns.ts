/** `data-cell-id` column segments — Make Detail grid */
export const IM_MAKE_GRID_COLUMNS = {
  makeCode: 'makeCode',
  makeName: 'makeName',
} as const;

/** `data-cell-id` column segments — Unit Conversion grid */
export const IM_UNIT_CONVERSION_GRID_COLUMNS = {
  unitTypeId: 'unitTypeId',
  unitConversionTypeId: 'unitConversionTypeId',
  fromUnit: 'fromUnit',
  fromUnitValue: 'fromUnitValue',
  toUnitId: 'toUnitId',
  toUnitValue: 'toUnitValue',
} as const;
