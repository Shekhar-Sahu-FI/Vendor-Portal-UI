import { Locator, Page, expect } from '@playwright/test';
import { fillDateByLabel } from './date-calendar.helper';

export type FieldValue = string | boolean | number;

export type InputType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'button';

/**
 * Returns parent container of label
 */
export function getFieldContainer(
  page: Page,
  labelText: string,
): Locator {
  const cleanLabel = labelText.trim();
  return page
    .locator(`label:has-text("${cleanLabel}")`)
    .first()
    .locator('xpath=ancestor::div[contains(@class, "flex-col") or .//button or .//input or .//select][1]');
}

/**
 * Returns actual input field
 */
export function getInputsByLabel(
  page: Page,
  labelText: string,
): Locator {

  const container = getFieldContainer(page, labelText);

  return container
    .locator(
      'input:not([type="checkbox"]):not([type="radio"]), textarea'
    )
    .first();
}

export async function fillTextField(
  page: Page,
  labelText: string,
  value: string,
): Promise<void> {

  const container = getFieldContainer(page, labelText);

  const input = getInputsByLabel(page, labelText);

  await input.waitFor({
    state: 'visible',
  });

  await input.scrollIntoViewIfNeeded();

  await input.click();

  await input.fill(value);
}

/** @deprecated Use `fillDateByLabel` from `date-calendar.helper` */
export async function setDateField(
  page: Page,
  labelText: string,
  value: string,
): Promise<void> {
  await fillDateByLabel(page, labelText, value);
}

export async function clickFieldButton(page: Page, labelText: string): Promise<void> {
  const container = getFieldContainer(page, labelText);
  await container.locator('button[type="button"], button').first().click();
}

export async function checkCheckbox(
  page: Page,
  labelText: string,
  checked: boolean = true,
): Promise<void> {
  const checkbox = getFieldContainer(page, labelText).locator('input[type="checkbox"]').first();
  if (checked) await checkbox.check();
  else await checkbox.uncheck();
}

export async function selectOption(
  page: Page,
  labelText: string,
  value: string,
): Promise<void> {
  const container = getFieldContainer(page, labelText);
  const nativeSelect = container.locator('select').first();

  if ((await nativeSelect.count()) > 0 && (await nativeSelect.isVisible({ timeout: 500 }).catch(() => false))) {
    await nativeSelect.selectOption({ label: value }).catch(async () => {
      await nativeSelect.selectOption({ value });
    });
    return;
  }

  // UCDropDown custom select
  const trigger = container
    .locator('button.uc-dropdown-trigger, button[aria-haspopup="listbox"], button')
    .first();
  await expect(trigger, `Dropdown trigger for "${labelText}" should be visible`).toBeVisible({ timeout: 10_000 });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();

  const menu = page.locator('ul.uc-dropdown-menu, ul[role="listbox"], [role="listbox"]').last();
  await expect(menu, `Dropdown menu for "${labelText}" should be visible`).toBeVisible({ timeout: 10_000 });

  const cleanValue = value.trim();
  const escapedValue = cleanValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  let option = menu
    .locator('[role="option"], li')
    .filter({ hasText: new RegExp(`^\\s*${escapedValue}\\s*$`, 'i') })
    .first();

  if (!(await option.isVisible({ timeout: 1_500 }).catch(() => false))) {
    option = menu
      .locator('[role="option"], li')
      .filter({ hasText: cleanValue })
      .first();
  }

  if (!(await option.isVisible({ timeout: 1_000 }).catch(() => false))) {
    option = menu.locator(`[role="option"][title="${cleanValue}"]`).first();
  }

  await expect(option, `Option "${value}" should be visible in dropdown "${labelText}"`).toBeVisible({ timeout: 10_000 });
  await option.click();

  await menu.waitFor({ state: 'hidden', timeout: 3_000 }).catch(() => {});
}

export async function selectRadio(
  page: Page,
  labelText: string,
  value: string,
): Promise<void> {
  const radio = getFieldContainer(page, labelText)
    .locator(`input[type="radio"][value="${value}"]`)
    .first();
  await radio.check();
}

export async function setField(page: Page, labelText: string, value: FieldValue): Promise<void> {
  const container = getFieldContainer(page, labelText);
  const hasDropdown = (await container.locator('select, button.uc-dropdown-trigger, button[aria-haspopup="listbox"]').count()) > 0;
  if (hasDropdown) {
    await selectOption(page, labelText, String(value));
    return;
  }

  const inputType = await container.locator('input').first().getAttribute('type');
  switch (inputType) {
    case 'checkbox':
      await checkCheckbox(page, labelText, Boolean(value));
      break;
    case 'radio':
      await selectRadio(page, labelText, String(value));
      break;
    case 'date':
      await fillDateByLabel(page, labelText, String(value));
      break;
    default:
      await fillTextField(page, labelText, String(value));
      break;
  }
}

export async function getFieldValue(page: Page, labelText: string): Promise<string> {
  const container = getFieldContainer(page, labelText);
  const input = container.locator('input, textarea, select').first();
  if ((await input.count()) > 0) {
    return input.inputValue();
  }
  const trigger = container.locator('button.uc-dropdown-trigger, button[aria-haspopup="listbox"]').first();
  if ((await trigger.count()) > 0) {
    return (await trigger.innerText()).trim();
  }
  return '';
}

export async function isFieldVisible(page: Page, labelText: string): Promise<boolean> {
  return getFieldContainer(page, labelText).isVisible();
}

export async function isFieldEnabled(page: Page, labelText: string): Promise<boolean> {
  const input = getFieldContainer(page, labelText).locator('input, textarea, select, button').first();
  return input.isEnabled();
}

export async function waitForField(
  page: Page,
  labelText: string,
  timeout: number = 5000,
): Promise<void> {
  await getFieldContainer(page, labelText).waitFor({ state: 'visible', timeout });
}

export async function clearField(page: Page, labelText: string): Promise<void> {
  const container = getFieldContainer(page, labelText);
  const clearBtn = container.locator('button[aria-label="Clear selection"]').first();
  if ((await clearBtn.count()) > 0 && (await clearBtn.isVisible().catch(() => false))) {
    await clearBtn.click();
    return;
  }
  const input = container.locator('input, textarea').first();
  await input.fill('');
}

/**
 * Selects first non-empty option when label is not provided.
 */
export async function selectFirstDropdownOption(page: Page, labelText: string): Promise<void> {
  const container = getFieldContainer(page, labelText);
  const nativeSelect = container.locator('select').first();

  if ((await nativeSelect.count()) > 0 && (await nativeSelect.isVisible({ timeout: 500 }).catch(() => false))) {
    const options = nativeSelect.locator('option');
    const count = await options.count();
    for (let i = 1; i < count; i++) {
      const value = await options.nth(i).getAttribute('value');
      if (value) {
        await nativeSelect.selectOption({ index: i });
        return;
      }
    }
    return;
  }

  // UCDropDown custom select
  const trigger = container
    .locator('button.uc-dropdown-trigger, button[aria-haspopup="listbox"], button')
    .first();
  await expect(trigger, `Dropdown trigger for "${labelText}" should be visible`).toBeVisible({ timeout: 10_000 });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();

  const menu = page.locator('ul.uc-dropdown-menu, ul[role="listbox"], [role="listbox"]').last();
  await expect(menu, `Dropdown menu for "${labelText}" should be visible`).toBeVisible({ timeout: 10_000 });

  const firstOption = menu
    .locator('[role="option"]:not([aria-disabled="true"]):not(:has-text("No options")), li:not([aria-disabled="true"]):not(:has-text("No options"))')
    .first();
  await expect(firstOption, `First option in dropdown "${labelText}" should be visible`).toBeVisible({ timeout: 10_000 });
  await firstOption.click();

  await menu.waitFor({ state: 'hidden', timeout: 3_000 }).catch(() => {});
}
