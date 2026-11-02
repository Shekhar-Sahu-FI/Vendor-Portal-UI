export function vendorMasterExpectField(field: string, expected: string | number | boolean): string {
  return `[Vendor Master] Expecting "${field}" to be "${expected}"`;
}

export function vendorMasterExpectUrl(urlDescription: string): string {
  return `[Vendor Master] Expecting page URL ${urlDescription}`;
}

export function vendorMasterExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Vendor Master] Expecting success toast after ${action}`;
}
