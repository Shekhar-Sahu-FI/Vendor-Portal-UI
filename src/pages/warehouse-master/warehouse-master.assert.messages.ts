/** Human-readable messages for Warehouse Master test assertions. */

export function warehouseExpectField(field: string, expected: string | number | boolean): string {
  return `[Warehouse Master] Expecting "${field}" to be "${expected}"`;
}

export function warehouseExpectFieldContains(field: string, expected: string): string {
  return `[Warehouse Master] Expecting "${field}" to contain "${expected}"`;
}

export function warehouseExpectFieldMatch(field: string, pattern: string): string {
  return `[Warehouse Master] Expecting "${field}" to match "${pattern}"`;
}

export function warehouseExpectUrl(urlDescription: string): string {
  return `[Warehouse Master] Expecting page URL ${urlDescription}`;
}

export function warehouseExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Warehouse Master] Expecting success toast after ${action}`;
}
