export function divisionExpectField(field: string, expected: string | number | boolean): string {
  return `[Division Master] Expecting "${field}" to be "${expected}"`;
}

export function divisionExpectUrl(urlDescription: string): string {
  return `[Division Master] Expecting page URL ${urlDescription}`;
}

export function divisionExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Division Master] Expecting success toast after ${action}`;
}
