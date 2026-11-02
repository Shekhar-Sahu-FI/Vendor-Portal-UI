export function cityExpectField(field: string, expected: string | number | boolean): string {
  return `[City Master] Expecting "${field}" to be "${expected}"`;
}

export function cityExpectUrl(urlDescription: string): string {
  return `[City Master] Expecting page URL ${urlDescription}`;
}

export function cityExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[City Master] Expecting success toast after ${action}`;
}
