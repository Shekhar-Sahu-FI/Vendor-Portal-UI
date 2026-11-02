export function docTypeExpectField(field: string, expected: string | number | boolean): string {
  return `[Doc Type Master] Expecting "${field}" to be "${expected}"`;
}

export function docTypeExpectUrl(urlDescription: string): string {
  return `[Doc Type Master] Expecting page URL ${urlDescription}`;
}

export function docTypeExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Doc Type Master] Expecting success toast after ${action}`;
}
