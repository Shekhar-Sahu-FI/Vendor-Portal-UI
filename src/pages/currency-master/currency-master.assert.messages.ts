export function currencyExpectField(field: string, expected: string | number | boolean): string {
  return `[Currency Master] Expecting "${field}" to be "${expected}"`;
}

export function currencyExpectUrl(urlDescription: string): string {
  return `[Currency Master] Expecting page URL ${urlDescription}`;
}

export function currencyExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Currency Master] Expecting success toast after ${action}`;
}
