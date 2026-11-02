export function costCenterExpectField(field: string, expected: string | number | boolean): string {
  return `[Cost Center Master] Expecting "${field}" to be "${expected}"`;
}

export function costCenterExpectUrl(urlDescription: string): string {
  return `[Cost Center Master] Expecting page URL ${urlDescription}`;
}

export function costCenterExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Cost Center Master] Expecting success toast after ${action}`;
}
