export function vendorRegistrationExpectField(field: string, expected: string | number | boolean): string {
  return `[Vendor Registration] Expecting "${field}" to be "${expected}"`;
}

export function vendorRegistrationExpectUrl(urlDescription: string): string {
  return `[Vendor Registration] Expecting page URL ${urlDescription}`;
}

export function vendorRegistrationExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Vendor Registration] Expecting success toast after ${action}`;
}
