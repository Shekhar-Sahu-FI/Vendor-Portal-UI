export function stateExpectField(field: string, expected: string | number | boolean): string {
  return `[State Master] Expecting "${field}" to be "${expected}"`;
}

export function stateExpectUrl(urlDescription: string): string {
  return `[State Master] Expecting page URL ${urlDescription}`;
}

export function stateExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[State Master] Expecting success toast after ${action}`;
}
