export function departmentExpectField(field: string, expected: string | number | boolean): string {
  return `[Department Master] Expecting "${field}" to be "${expected}"`;
}

export function departmentExpectUrl(urlDescription: string): string {
  return `[Department Master] Expecting page URL ${urlDescription}`;
}

export function departmentExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Department Master] Expecting success toast after ${action}`;
}
