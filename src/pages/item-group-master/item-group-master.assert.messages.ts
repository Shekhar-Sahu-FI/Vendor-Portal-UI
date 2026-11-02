export function itemGroupExpectField(field: string, expected: string | number | boolean): string {
  return `[Item Group Master] Expecting "${field}" to be "${expected}"`;
}

export function itemGroupExpectUrl(urlDescription: string): string {
  return `[Item Group Master] Expecting page URL ${urlDescription}`;
}

export function itemGroupExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Item Group Master] Expecting success toast after ${action}`;
}
