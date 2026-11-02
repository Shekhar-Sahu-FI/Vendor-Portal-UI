export function vendorLocationExpectField(field: string, expected: string | number | boolean): string {
  return `[Vendor Location Master] Expecting "${field}" to be "${expected}"`;
}

export function vendorLocationExpectUrl(urlDescription: string): string {
  return `[Vendor Location Master] Expecting page URL ${urlDescription}`;
}

export function vendorLocationExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Vendor Location Master] Expecting success toast after ${action}`;
}
