export function countryExpectField(field: string, expected: string | number | boolean): string {
  return `[Country Master] Expecting "${field}" to be "${expected}"`;
}

export function countryExpectUrl(urlDescription: string): string {
  return `[Country Master] Expecting page URL ${urlDescription}`;
}

export function countryExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Country Master] Expecting success toast after ${action}`;
}
