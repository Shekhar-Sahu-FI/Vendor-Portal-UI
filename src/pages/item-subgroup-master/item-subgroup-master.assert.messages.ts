export function itemSubgroupExpectField(field: string, expected: string | number | boolean): string {
  return `[Item Subgroup Master] Expecting "${field}" to be "${expected}"`;
}

export function itemSubgroupExpectUrl(urlDescription: string): string {
  return `[Item Subgroup Master] Expecting page URL ${urlDescription}`;
}

export function itemSubgroupExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Item Subgroup Master] Expecting success toast after ${action}`;
}
