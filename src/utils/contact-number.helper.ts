import { expect, Locator, Page } from '@playwright/test';
import { getFieldContainer } from './field-accessor';

/** Country search + local digits for `ContactNumberInput` (uc-contact-number.tsx). */
export type ContactNumberFill = {
  /** Matches country name, ISO code, or phone code — e.g. "India", "IN", "+91". */
  countrySearch: string;
  /** Local number without country code — e.g. "9876543210". */
  localNumber: string;
};

const DEFAULT_COUNTRY_SEARCH = 'India';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function contactFieldContainer(page: Page, label: string): Locator {
  return getFieldContainer(page, label);
}

function countryPickerPanel(page: Page): Locator {
  return page
    .locator('input[placeholder="Search country..."]')
    .locator('xpath=ancestor::div[contains(@class,"shadow-xl")]')
    .first();
}

/**
 * Opens the country code popover on a labelled `ContactNumberInput`.
 */
export async function openContactCountryPicker(page: Page, label: string): Promise<void> {
  const container = contactFieldContainer(page, label);
  const toggle = container.locator('button[type="button"]').first();

  await toggle.scrollIntoViewIfNeeded();
  await expect(toggle).toBeVisible({ timeout: 10_000 });
  await toggle.click();

  await expect(page.getByPlaceholder('Search country...')).toBeVisible({ timeout: 10_000 });
}

/**
 * Searches and selects a country in the open `ContactNumberInput` popover.
 */
export async function selectContactCountry(page: Page, countrySearch: string): Promise<void> {
  const search = page.getByPlaceholder('Search country...');
  await expect(search).toBeVisible({ timeout: 10_000 });
  await search.fill('');
  await search.fill(countrySearch);

  const panel = countryPickerPanel(page);
  const countryRow = panel
    .locator('.overflow-y-auto > div')
    .filter({ hasText: new RegExp(countrySearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') })
    .first();

  await expect(countryRow).toBeVisible({ timeout: 10_000 });
  await countryRow.click();
  await expect(search).toBeHidden({ timeout: 5_000 });
}

/**
 * Fills the local phone digits in a labelled `ContactNumberInput`.
 */
export async function fillContactLocalNumber(
  page: Page,
  label: string,
  localNumber: string,
): Promise<void> {
  const input = contactFieldContainer(page, label)
    .locator('input[type="tel"], input[type="text"]:not([placeholder*="Search country" i])')
    .first();
  const digits = digitsOnly(localNumber);

  await expect(input).toBeVisible({ timeout: 10_000 });
  await input.scrollIntoViewIfNeeded();
  await input.click();
  await input.fill('');
  await input.fill(digits);
  await input.blur();
}

/**
 * Full flow: pick country → enter local number (`ContactNumberInput`).
 */
export async function fillContactNumber(
  page: Page,
  label: string,
  data: ContactNumberFill | string,
): Promise<void> {
  if (typeof data === 'string') {
    await fillContactLocalNumber(page, label, data);
    return;
  }

  await openContactCountryPicker(page, label);
  await selectContactCountry(page, data.countrySearch);
  await fillContactLocalNumber(page, label, data.localNumber);
}

/**
 * Same as `fillContactNumber` inside a grid cell (`CountryContactNoEditor`).
 */
export async function fillContactNumberInCell(
  page: Page,
  cell: Locator,
  data: ContactNumberFill,
): Promise<void> {
  const toggle = cell.locator('button[type="button"]').first();
  await toggle.click();

  await selectContactCountry(page, data.countrySearch);

  const input = cell
    .locator('input[type="tel"], input[type="text"]:not([placeholder*="Search country" i])')
    .first();
  const digits = digitsOnly(data.localNumber);
  await input.fill('');
  await input.fill(digits);
  await input.blur();
}

export async function readContactLocalNumber(page: Page, label: string): Promise<string> {
  const input = contactFieldContainer(page, label)
    .locator('input[type="tel"], input[type="text"]:not([placeholder*="Search country" i])')
    .first();
  return input.inputValue();
}

export async function fillContactNumberWithDefaultCountry(
  page: Page,
  label: string,
  localNumber: string,
  countrySearch = DEFAULT_COUNTRY_SEARCH,
): Promise<void> {
  await fillContactNumber(page, label, { countrySearch, localNumber });
}
