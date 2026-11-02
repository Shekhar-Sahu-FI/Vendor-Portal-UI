export function priorityExpectField(field: string, expected: string | number | boolean): string {
  return `[Priority Master] Expecting "${field}" to be "${expected}"`;
}

export function priorityExpectUrl(urlDescription: string): string {
  return `[Priority Master] Expecting page URL ${urlDescription}`;
}

export function priorityExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Priority Master] Expecting success toast after ${action}`;
}
