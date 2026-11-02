import { expect, Page } from '@playwright/test';
import {
  GENERAL_DETAIL_LABELS,
  MAIL_SUBJECT_LABELS,
} from '../pages/request-for-quotation/request-for-quotation.constants';
import type { RfqFieldLimitSpec } from '../pages/request-for-quotation/rfq-field-limits.catalog';
import { getInputsByLabel, fillTextField } from './field-accessor';
import { TextAreaOverlayHelper } from './textarea-overlay.helper';
import { DataCellTable } from './data-cell-table';
import { RFQ_ITEM_GRID_COLUMNS } from '../pages/request-for-quotation/grids/request-for-quotation-grid.columns';

export type FieldLimitCheckResult = {
  fieldId: string;
  section: string;
  label: string;
  limit: string;
  status: 'pass' | 'fail';
  detail?: string;
};

function charSample(length: number, seed = 'a'): string {
  return seed.repeat(length);
}

async function readInputMaxLength(page: Page, label: string): Promise<number | null> {
  const input = getInputsByLabel(page, label);
  const attr = await input.getAttribute('maxlength');
  if (attr) return Number(attr);
  const attr2 = await input.getAttribute('maxLength');
  return attr2 ? Number(attr2) : null;
}

/**
 * Verifies the input accepts exactly maxLength chars and blocks (or trims) beyond it.
 */
export async function verifyInputMaxLength(
  page: Page,
  label: string,
  maxLength: number,
): Promise<string | null> {
  const input = getInputsByLabel(page, label);
  await input.scrollIntoViewIfNeeded();
  await input.fill('');
  await input.fill(charSample(maxLength));
  const atMax = await input.inputValue();
  if (atMax.length !== maxLength) {
    return `At max: expected length ${maxLength}, got ${atMax.length}`;
  }

  await input.press('End');
  await page.keyboard.type('Z');
  const over = await input.inputValue();
  if (over.length > maxLength) {
    return `Over max: expected ≤ ${maxLength} after extra keystroke, got ${over.length}`;
  }

  const htmlMax = await readInputMaxLength(page, label);
  if (htmlMax !== null && htmlMax !== maxLength) {
    return `HTML maxlength attribute is ${htmlMax}, expected ${maxLength}`;
  }

  return null;
}

async function verifyTextareaMaxLength(
  page: Page,
  label: string,
  maxLength: number,
): Promise<string | null> {
  const container = page.locator(`label:has-text("${label}")`).locator('xpath=..').first();
  const textarea = container.locator('textarea').first();
  await textarea.scrollIntoViewIfNeeded();
  await textarea.fill('');
  await textarea.fill(charSample(maxLength));
  const atMax = await textarea.inputValue();
  if (atMax.length !== maxLength) {
    return `At max: expected length ${maxLength}, got ${atMax.length}`;
  }

  await textarea.press('End');
  await page.keyboard.type('Z');
  const over = await textarea.inputValue();
  if (over.length > maxLength) {
    return `Over max: expected ≤ ${maxLength}, got ${over.length}`;
  }

  return null;
}

async function verifyGridTextareaMaxLength(
  page: Page,
  spec: RfqFieldLimitSpec,
): Promise<string | null> {
  const maxLength = spec.maxLength!;
  const rowIndex = spec.rowIndex ?? 0;
  const columnId = spec.columnId!;
  const table = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);
  const cell = table.cell(rowIndex, columnId as keyof typeof RFQ_ITEM_GRID_COLUMNS);
  await cell.scrollIntoViewIfNeeded();
  await cell.getByRole('button').first().click();

  const overlay = new TextAreaOverlayHelper(page);
  await overlay.waitForVisible(spec.overlayPlaceholder);

  let target = overlay.textareaWithoutPlaceholder();
  if (spec.overlayPlaceholder) {
    const withPh = overlay.textarea(spec.overlayPlaceholder);
    if (await withPh.count()) target = withPh;
  }

  await target.fill(charSample(maxLength));
  const atMax = await target.inputValue();
  if (atMax.length !== maxLength) {
    await page.keyboard.press('Escape');
    return `Overlay at max: expected ${maxLength}, got ${atMax.length}`;
  }

  await target.press('End');
  await page.keyboard.type('Z');
  const over = await target.inputValue();
  if (over.length > maxLength) {
    await page.keyboard.press('Escape');
    return `Overlay over max: expected ≤ ${maxLength}, got ${over.length}`;
  }

  await overlay.enterTextAndSave(atMax.slice(0, maxLength), spec.overlayPlaceholder);
  return null;
}

async function verifyGridNumericLimits(
  page: Page,
  spec: RfqFieldLimitSpec,
): Promise<string | null> {
  const rowIndex = spec.rowIndex ?? 0;
  const columnId = spec.columnId!;
  const table = new DataCellTable(page, RFQ_ITEM_GRID_COLUMNS);
  const input = table.input(rowIndex, columnId as keyof typeof RFQ_ITEM_GRID_COLUMNS);

  if (spec.maxNumericLength && spec.validNumericSample && spec.invalidNumericSample) {
    await input.scrollIntoViewIfNeeded();
    await input.click();
    await input.fill('');
    await input.fill(spec.validNumericSample);
    const valid = await input.inputValue();
    const validDigits = valid.replace(/[^0-9]/g, '');
    const expectedDigits = spec.validNumericSample.replace(/[^0-9]/g, '');
    if (!valid.includes(expectedDigits.slice(0, spec.maxNumericLength))) {
      return `Valid sample "${spec.validNumericSample}" not accepted (got "${valid}")`;
    }

    await input.fill('');
    await input.fill(spec.invalidNumericSample);
    const invalid = await input.inputValue();
    const invalidDigits = invalid.replace(/[^0-9]/g, '');
    if (invalidDigits.length > spec.maxNumericLength) {
      return `Invalid sample should cap at ${spec.maxNumericLength} digits, got ${invalidDigits.length} in "${invalid}"`;
    }
    await page.keyboard.press('Tab');
    return null;
  }

  if (spec.decimalPlaces !== undefined && spec.validNumericSample && spec.invalidNumericSample) {
    await input.scrollIntoViewIfNeeded();
    await input.click();
    await input.fill('');
    await input.fill(spec.validNumericSample);
    const valid = await input.inputValue();
    if (!valid.includes('1.234') && spec.validNumericSample === '1.234') {
      return `Valid decimal "${spec.validNumericSample}" not accepted (got "${valid}")`;
    }

    await input.fill('');
    await input.fill(spec.invalidNumericSample);
    const invalid = await input.inputValue();
    const parts = invalid.split('.');
    if (parts[1] && parts[1].length > spec.decimalPlaces) {
      return `Expected ≤ ${spec.decimalPlaces} decimal places, got "${invalid}"`;
    }
    await page.keyboard.press('Tab');
    return null;
  }

  return 'Numeric check misconfigured';
}

async function verifySaveMaxLength(
  page: Page,
  spec: RfqFieldLimitSpec,
  triggerSave: () => Promise<void>,
): Promise<string | null> {
  const maxLength = spec.maxLength!;
  const over = charSample(maxLength + 1);

  if (spec.id.includes('remarks')) {
    const container = page.locator(`label:has-text("${GENERAL_DETAIL_LABELS.remarks}")`).locator('xpath=..').first();
    const textarea = container.locator('textarea').first();
    await textarea.fill(over);
  } else if (spec.id.includes('mailSubject')) {
    await fillTextField(page, MAIL_SUBJECT_LABELS.mailSubject, over);
  } else {
    return 'Save validation field not mapped';
  }

  await triggerSave();

  const pattern = spec.overLimitMessage!;
  const message = page.getByText(pattern).first();
  const visible = await message.isVisible().catch(() => false);
  if (!visible) {
    return `Expected save validation message matching ${pattern} for ${maxLength + 1} characters`;
  }

  return null;
}

export async function runRfqFieldLimitCheck(
  page: Page,
  spec: RfqFieldLimitSpec,
  options: { triggerSave: () => Promise<void> },
): Promise<FieldLimitCheckResult> {
  const base = {
    fieldId: spec.id,
    section: spec.section,
    label: spec.label,
    limit: spec.limitDescription,
  };

  try {
    let failure: string | null = null;

    switch (spec.checkType) {
      case 'labeledInput':
        failure = await verifyInputMaxLength(page, spec.label, spec.maxLength!);
        break;
      case 'labeledTextarea':
        failure = await verifyTextareaMaxLength(page, spec.label, spec.maxLength!);
        break;
      case 'mailSubject':
        failure = await verifyInputMaxLength(page, MAIL_SUBJECT_LABELS.mailSubject, spec.maxLength!);
        break;
      case 'gridTextarea':
        failure = await verifyGridTextareaMaxLength(page, spec);
        break;
      case 'gridInput':
        failure = await verifyGridNumericLimits(page, spec);
        break;
      case 'saveValidation':
        failure = await verifySaveMaxLength(page, spec, options.triggerSave);
        break;
      default:
        failure = `Unknown check type: ${spec.checkType}`;
    }

    if (failure) {
      return { ...base, status: 'fail', detail: failure };
    }
    return { ...base, status: 'pass' };
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    return { ...base, status: 'fail', detail };
  }
}

export function formatFieldLimitReport(results: FieldLimitCheckResult[]): string {
  const lines = [
    'RFQ Field Limit Check Report',
    '═'.repeat(72),
    `${'Status'.padEnd(6)} | ${'Section'.padEnd(18)} | ${'Field'.padEnd(28)} | Limit`,
    '─'.repeat(72),
  ];

  for (const r of results) {
    const status = r.status === 'pass' ? 'PASS' : 'FAIL';
    lines.push(
      `${status.padEnd(6)} | ${r.section.padEnd(18)} | ${r.label.padEnd(28)} | ${r.limit}`,
    );
    if (r.detail) {
      lines.push(`       └─ ${r.detail}`);
    }
  }

  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  lines.push('─'.repeat(72));
  lines.push(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

  return lines.join('\n');
}

export function assertAllFieldLimitChecks(results: FieldLimitCheckResult[]): void {
  const failures = results.filter((r) => r.status === 'fail');
  expect(
    failures,
    `\n${formatFieldLimitReport(results)}\n`,
  ).toHaveLength(0);
}
