export function companyLocationExpectField(field: string, expected: string | number | boolean): string {
  return `[Company Location Master] Expecting "${field}" to be "${expected}"`;
}

export function companyLocationExpectUrl(urlDescription: string): string {
  return `[Company Location Master] Expecting page URL ${urlDescription}`;
}

export function companyLocationExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Company Location Master] Expecting success toast after ${action}`;
}
