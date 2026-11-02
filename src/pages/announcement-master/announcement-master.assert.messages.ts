export function announcementExpectField(field: string, expected: string | number | boolean): string {
  return `[Announcement Master] Expecting "${field}" to be "${expected}"`;
}

export function announcementExpectUrl(urlDescription: string): string {
  return `[Announcement Master] Expecting page URL ${urlDescription}`;
}

export function announcementExpectSuccessToast(action: 'save' | 'update' | 'delete'): string {
  return `[Announcement Master] Expecting success toast after ${action}`;
}
