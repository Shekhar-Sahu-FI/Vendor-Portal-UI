export function csReasonExpectField(field: string, expected: string | number | boolean): string {
  return `[CS Reason Master] Expecting "${field}" to be "${expected}"`;
}

export function csReasonExpectUrl(urlDescription: string): string {
  return `[CS Reason Master] Expecting page URL ${urlDescription}`;
}

export function csReasonExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[CS Reason Master] Expecting success toast after ${action}`;
}
