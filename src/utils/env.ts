export const env = {
  baseUrl: process.env.BASE_URL ?? 'http://localhost:5173',
  apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:5000',
  /** Login identifier: username, email, or contact number */
  testUsername: process.env.TEST_USERNAME ?? process.env.TEST_EMAIL ?? '',
  testPassword: process.env.TEST_PASSWORD ?? '',
  /** Portal prefix for routes: `company` or `vendor` */
  userPortal: (process.env.USER_PORTAL ?? 'company') as 'company' | 'vendor',
  buId: process.env.BU_ID ? Number(process.env.BU_ID) : undefined,
  portalSettingsTimeoutMs: Number(process.env.PORTAL_SETTINGS_TIMEOUT_MS ?? 3_000),
} as const;

export function requireEnv(value: string, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function purchaseRequestPath(
  portal: string,
  suffix: '' | '/new' | `/edit` = '',
  id?: number | string,
) {
  const base = `/${portal}/transaction/purchase-request`;
  if (suffix === '/new') return `${base}/new`;
  if (id && suffix === `/edit`) return `${base}/${id}/edit`;
  if (id) return `${base}/${id}`;
  return base;
}
