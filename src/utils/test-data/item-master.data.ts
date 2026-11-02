import { ItemMasterFillData } from '../../types/item-master.types';

const suggest = (query: string, value: string) => ({ query, value });

/** Minimal Item Master data for save tests (Make Management Type = None). */
export function buildItemMasterSaveData(uniqueMarker: string): ItemMasterFillData {
  return {
    subgroup: suggest('Struct', 'Structural'),
    itemName: `Auto Item ${uniqueMarker}`,
    stockUnit: suggest('MT', 'MT'),
    makeMgmtType: 'None',
    status: 'Active',
  };
}
