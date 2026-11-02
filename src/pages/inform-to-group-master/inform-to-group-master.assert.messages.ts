export function informToGroupExpectField(field: string, expected: string | number | boolean): string {
  return `[Inform To Group Master] Expecting "${field}" to be "${expected}"`;
}

export function informToGroupExpectUrl(urlDescription: string): string {
  return `[Inform To Group Master] Expecting page URL ${urlDescription}`;
}

export function informToGroupExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Inform To Group Master] Expecting success toast after ${action}`;
}
