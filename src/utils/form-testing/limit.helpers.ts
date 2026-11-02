import { Page } from '@playwright/test';
import { getInputsByLabel, fillTextField } from '../field-accessor';
import { TextAreaOverlayHelper } from '../textarea-overlay.helper';
import { DataCellTable } from '../data-cell-table';
import type { FormCheck, FormCheckContext, FormCheckFn, FormCheckResult } from './types';

const sample = (n: number) => 'a'.repeat(n);

async function checkInputMaxLength(page: Page, label: string, max: number): Promise<string | null> {
  const input = getInputsByLabel(page, label);
  await input.scrollIntoViewIfNeeded();
  await input.fill(sample(max));
  if ((await input.inputValue()).length !== max) {
    return `Expected ${max} chars at max`;
  }
  await input.press('End');
  await page.keyboard.type('Z');
  if ((await input.inputValue()).length > max) {
    return `Should not exceed ${max} chars`;
  }
  return null;
}

async function checkTextareaMaxLength(page: Page, label: string, max: number): Promise<string | null> {
  const textarea = page
    .locator(`label:has-text("${label}")`)
    .locator('xpath=..')
    .first()
    .locator('textarea')
    .first();
  await textarea.fill(sample(max));
  if ((await textarea.inputValue()).length !== max) {
    return `Expected ${max} chars at max`;
  }
  await textarea.press('End');
  await page.keyboard.type('Z');
  if ((await textarea.inputValue()).length > max) {
    return `Should not exceed ${max} chars`;
  }
  return null;
}

async function checkGridTextareaMaxLength(
  page: Page,
  row: number,
  columnId: string,
  columns: Record<string, string>,
  max: number,
  overlayPlaceholder?: string,
): Promise<string | null> {
  const table = new DataCellTable(page, columns);
  await table.cell(row, columnId as keyof typeof columns).getByRole('button').first().click();
  const overlay = new TextAreaOverlayHelper(page);
  await overlay.waitForVisible(overlayPlaceholder);
  let target = overlay.textareaWithoutPlaceholder();
  if (overlayPlaceholder && (await overlay.textarea(overlayPlaceholder).count())) {
    target = overlay.textarea(overlayPlaceholder);
  }
  await target.fill(sample(max));
  if ((await target.inputValue()).length !== max) {
    await page.keyboard.press('Escape');
    return `Overlay expected ${max} chars at max`;
  }
  await target.press('End');
  await page.keyboard.type('Z');
  if ((await target.inputValue()).length > max) {
    await page.keyboard.press('Escape');
    return `Overlay should not exceed ${max} chars`;
  }
  await overlay.enterTextAndSave(sample(max), overlayPlaceholder);
  return null;
}

async function checkGridMaxDigits(
  page: Page,
  row: number,
  columnId: string,
  columns: Record<string, string>,
  maxDigits: number,
  overSample: string,
): Promise<string | null> {
  const input = new DataCellTable(page, columns).input(row, columnId as keyof typeof columns);
  await input.click();
  await input.fill(overSample);
  const digits = (await input.inputValue()).replace(/[^0-9]/g, '');
  if (digits.length > maxDigits) {
    return `Should cap at ${maxDigits} digits, got ${digits.length}`;
  }
  await page.keyboard.press('Tab');
  return null;
}

async function checkGridDecimalPlaces(
  page: Page,
  row: number,
  columnId: string,
  columns: Record<string, string>,
  places: number,
  overSample: string,
): Promise<string | null> {
  const input = new DataCellTable(page, columns).input(row, columnId as keyof typeof columns);
  await input.click();
  await input.fill(overSample);
  const fraction = (await input.inputValue()).split('.')[1];
  if (fraction && fraction.length > places) {
    return `Should allow max ${places} decimal places`;
  }
  await page.keyboard.press('Tab');
  return null;
}

/** Build checks — reusable across forms. */
export function inputMax(
  id: string,
  section: string,
  label: string,
  max: number,
): FormCheck {
  return {
    id,
    section,
    label,
    limit: `max ${max} characters`,
    run: ({ page }) => checkInputMaxLength(page, label, max),
  };
}

export function textareaMax(
  id: string,
  section: string,
  label: string,
  max: number,
): FormCheck {
  return {
    id,
    section,
    label,
    limit: `max ${max} characters`,
    run: ({ page }) => checkTextareaMaxLength(page, label, max),
  };
}

export function gridTextMax(
  id: string,
  section: string,
  label: string,
  columns: Record<string, string>,
  row: number,
  columnId: string,
  max: number,
  overlayPlaceholder?: string,
): FormCheck {
  return {
    id,
    section,
    label,
    limit: `max ${max} characters`,
    run: ({ page }) =>
      checkGridTextareaMaxLength(page, row, columnId, columns, max, overlayPlaceholder),
  };
}

export function gridMaxDigits(
  id: string,
  section: string,
  label: string,
  columns: Record<string, string>,
  row: number,
  columnId: string,
  maxDigits: number,
  overSample: string,
): FormCheck {
  return {
    id,
    section,
    label,
    limit: `max ${maxDigits} digits`,
    run: ({ page }) => checkGridMaxDigits(page, row, columnId, columns, maxDigits, overSample),
  };
}

export function gridDecimalPlaces(
  id: string,
  section: string,
  label: string,
  columns: Record<string, string>,
  row: number,
  columnId: string,
  places: number,
  overSample: string,
): FormCheck {
  return {
    id,
    section,
    label,
    limit: `max ${places} decimal places`,
    run: ({ page }) =>
      checkGridDecimalPlaces(page, row, columnId, columns, places, overSample),
  };
}

export function saveMaxLength(
  id: string,
  section: string,
  label: string,
  max: number,
  fillOver: (page: Page) => Promise<void>,
  message: string | RegExp,
): FormCheck {
  return {
    id,
    section,
    label,
    limit: `max ${max} characters on save`,
    run: async ({ page, triggerSave }) => {
      await fillOver(page);
      await triggerSave();
      const visible = await page.getByText(message).first().isVisible().catch(() => false);
      return visible ? null : `Missing message: ${message}`;
    },
  };
}

export function customCheck(
  id: string,
  section: string,
  label: string,
  limit: string,
  run: FormCheckFn,
): FormCheck {
  return { id, section, label, limit, run };
}

export async function runFormChecks(
  checks: FormCheck[],
  ctx: FormCheckContext,
): Promise<FormCheckResult[]> {
  const results: FormCheckResult[] = [];

  for (const check of checks) {
    const base = {
      id: check.id,
      section: check.section,
      label: check.label,
      limit: check.limit,
    };
    try {
      const detail = await check.run(ctx);
      results.push({ ...base, status: detail ? 'fail' : 'pass', detail: detail ?? undefined });
    } catch (error) {
      results.push({
        ...base,
        status: 'fail',
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

export function formatFormCheckReport(title: string, results: FormCheckResult[]): string {
  const lines = [title, '─'.repeat(60)];
  for (const r of results) {
    lines.push(`${r.status === 'pass' ? 'PASS' : 'FAIL'} | ${r.section} | ${r.label} | ${r.limit}`);
    if (r.detail) lines.push(`  → ${r.detail}`);
  }
  const passed = results.filter((r) => r.status === 'pass').length;
  lines.push('─'.repeat(60));
  lines.push(`Total ${results.length} | Passed ${passed} | Failed ${results.length - passed}`);
  return lines.join('\n');
}
