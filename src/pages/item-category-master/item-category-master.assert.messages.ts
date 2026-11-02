export function itemCategoryExpectField(field: string, expected: string | number | boolean): string {
  return `[Item Category Master] Expecting "${field}" to be "${expected}"`;
}

export function itemCategoryExpectUrl(urlDescription: string): string {
  return `[Item Category Master] Expecting page URL ${urlDescription}`;
}

export function itemCategoryExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Item Category Master] Expecting success toast after ${action}`;
}
