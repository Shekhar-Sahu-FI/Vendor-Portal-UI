/** Human-readable messages for Item Master test assertions. */

export function imExpectField(field: string, expected: string | number | boolean): string {
  return `[Item Master] Expecting "${field}" to be "${expected}"`;
}

export function imExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Item Master] Expecting success toast after ${action}`;
}
