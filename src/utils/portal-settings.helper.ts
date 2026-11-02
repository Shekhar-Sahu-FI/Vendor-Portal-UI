import { Page } from '@playwright/test';
import { env } from './env';

/** RFQ-related flags from `/api/config/portal-setting` (portal-config-context). */
export interface RfqPortalSettings {
  isRfqItemMakeRequired: boolean;
  isRfqItemTechSpecRequired: boolean;
  isRfqGuestVendorAllowed: boolean;
  isRfqMultipleContactPersonsAllowed: boolean;
  isDisableTncInRfq: boolean;
  isItemMultipleUnitApplicable: boolean;
  rfqPrWarningScope: number;
}

const DEFAULT_RFQ_PORTAL_SETTINGS: RfqPortalSettings = {
  isRfqItemMakeRequired: false,
  isRfqItemTechSpecRequired: false,
  isRfqGuestVendorAllowed: false,
  isRfqMultipleContactPersonsAllowed: false,
  isDisableTncInRfq: false,
  isItemMultipleUnitApplicable: false,
  rfqPrWarningScope: 0,
};

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === '') return fallback;
  return value === 'true' || value === '1';
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Reads RFQ portal flags from env overrides (RFQ_PORTAL_*) or the portal-setting API response.
 */
export function rfqPortalSettingsFromEnv(): RfqPortalSettings {
  return {
    isRfqItemMakeRequired: parseBool(
      process.env.RFQ_PORTAL_ITEM_MAKE_REQUIRED,
      DEFAULT_RFQ_PORTAL_SETTINGS.isRfqItemMakeRequired,
    ),
    isRfqItemTechSpecRequired: parseBool(
      process.env.RFQ_PORTAL_ITEM_TECH_SPEC_REQUIRED,
      DEFAULT_RFQ_PORTAL_SETTINGS.isRfqItemTechSpecRequired,
    ),
    isRfqGuestVendorAllowed: parseBool(
      process.env.RFQ_PORTAL_GUEST_VENDOR_ALLOWED,
      DEFAULT_RFQ_PORTAL_SETTINGS.isRfqGuestVendorAllowed,
    ),
    isRfqMultipleContactPersonsAllowed: parseBool(
      process.env.RFQ_PORTAL_MULTIPLE_CONTACTS_ALLOWED,
      DEFAULT_RFQ_PORTAL_SETTINGS.isRfqMultipleContactPersonsAllowed,
    ),
    isDisableTncInRfq: parseBool(
      process.env.RFQ_PORTAL_DISABLE_TNC,
      DEFAULT_RFQ_PORTAL_SETTINGS.isDisableTncInRfq,
    ),
    isItemMultipleUnitApplicable: parseBool(
      process.env.RFQ_PORTAL_MULTI_UNIT,
      DEFAULT_RFQ_PORTAL_SETTINGS.isItemMultipleUnitApplicable,
    ),
    rfqPrWarningScope: parseNumber(
      process.env.RFQ_PORTAL_PR_WARNING_SCOPE,
      DEFAULT_RFQ_PORTAL_SETTINGS.rfqPrWarningScope,
    ),
  };
}

function mapPortalPayload(data: Record<string, unknown>): RfqPortalSettings {
  return {
    isRfqItemMakeRequired: Boolean(data.isRfqItemMakeRequired),
    isRfqItemTechSpecRequired: Boolean(data.isRfqItemTechSpecRequired),
    isRfqGuestVendorAllowed: Boolean(data.isRfqGuestVendorAllowed),
    isRfqMultipleContactPersonsAllowed: Boolean(data.isRfqMultipleContactPersonsAllowed),
    isDisableTncInRfq: Boolean(data.isDisableTncInRfq),
    isItemMultipleUnitApplicable: Boolean(
      data.isItemMultipleUnitApplicable ?? data.isItemMultiUnitApplicable,
    ),
    rfqPrWarningScope: Number(data.rfqPrWarningScopeId ?? data.rfqPrWarningScope ?? 0),
  };
}

/**
 * Waits for portal-setting API (if not already loaded) and returns RFQ flags.
 * Env vars override API values when set.
 */
export async function loadRfqPortalSettings(page: Page): Promise<RfqPortalSettings> {
  const envOverrides = rfqPortalSettingsFromEnv();
  const hasEnvOverride = Object.keys(process.env).some((key) => key.startsWith('RFQ_PORTAL_'));

  if (process.env.RFQ_PORTAL_FETCH_API !== '1' && !hasEnvOverride) {
    return DEFAULT_RFQ_PORTAL_SETTINGS;
  }

  let apiSettings = DEFAULT_RFQ_PORTAL_SETTINGS;

  try {
    const response = await page.waitForResponse(
      (res) =>
        res.url().includes('/api/config/portal-setting')
        && res.request().method() === 'GET'
        && res.ok(),
      { timeout: env.portalSettingsTimeoutMs },
    );
    const body = (await response.json()) as { success?: boolean; data?: Record<string, unknown> };
    if (body?.success && body.data) {
      apiSettings = mapPortalPayload(body.data);
    }
  } catch {
    /* use defaults when portal-setting was already fetched before this call */
  }

  if (!hasEnvOverride) {
    return apiSettings;
  }

  return {
    ...apiSettings,
    ...envOverrides,
  };
}
