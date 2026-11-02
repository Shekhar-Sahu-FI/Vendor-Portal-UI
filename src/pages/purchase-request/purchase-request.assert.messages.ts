/** Human-readable messages for Purchase Request test assertions. */

export function prExpectField(field: string, expected: string | number | boolean): string {
  return `[Purchase Request] Expecting "${field}" to be "${expected}"`;
}

export function prExpectFieldContains(field: string, expected: string): string {
  return `[Purchase Request] Expecting "${field}" to contain "${expected}"`;
}

export function prExpectFieldMatch(field: string, pattern: string): string {
  return `[Purchase Request] Expecting "${field}" to match "${pattern}"`;
}

export function prExpectUrl(urlDescription: string): string {
  return `[Purchase Request] Expecting page URL ${urlDescription}`;
}

export function prExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Purchase Request] Expecting success toast after ${action}`;
}

export function prExpectItemRowField(
  rowIndex: number,
  field: string,
  expected: string | number,
): string {
  return `[Purchase Request] Expecting item row ${rowIndex + 1} "${field}" to be "${expected}"`;
}

export function prExpectInformToRow(rowIndex: number, expected: string): string {
  return `[Purchase Request] Expecting inform-to row ${rowIndex + 1} person to be "${expected}"`;
}
