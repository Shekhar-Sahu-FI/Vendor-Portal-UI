export function companyExpectField(field: string, expected: string | number | boolean): string {
  return `[Company Master] Expecting "${field}" to be "${expected}"`;
}

export function companyExpectUrl(urlDescription: string): string {
  return `[Company Master] Expecting page URL ${urlDescription}`;
}

export function companyExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Company Master] Expecting success toast after ${action}`;
}
