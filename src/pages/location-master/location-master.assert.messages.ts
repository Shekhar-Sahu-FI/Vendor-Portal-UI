export function locationExpectField(field: string, expected: string | number | boolean): string {
  return `[Location Master] Expecting "${field}" to be "${expected}"`;
}

export function locationExpectUrl(urlDescription: string): string {
  return `[Location Master] Expecting page URL ${urlDescription}`;
}

export function locationExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Location Master] Expecting success toast after ${action}`;
}
