/** Human-readable messages for Approval Setup Master test assertions. */

export function asmExpectField(field: string, expected: string | number | boolean): string {
  return `[Approval Setup] Expecting "${field}" to be "${expected}"`;
}

export function asmExpectUrl(urlDescription: string): string {
  return `[Approval Setup] Expecting page URL ${urlDescription}`;
}

export function asmExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Approval Setup] Expecting success toast after ${action}`;
}
