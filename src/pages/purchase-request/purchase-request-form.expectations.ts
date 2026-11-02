import { expect, Page } from '@playwright/test';
import { PurchaseRequestFillData } from '../../types/purchase-request.types';
import { ContactNumberFill, readContactLocalNumber } from '../../utils/contact-number.helper';
import { DataCellTable } from '../../utils/data-cell-table';
import { getFieldValue, getInputsByLabel } from '../../utils/field-accessor';
import {
  DOCUMENT_DETAIL_LABELS,
  GENERAL_DETAIL_LABELS,
} from './purchase-request.constants';
import {
  PR_ITEM_GRID_COLUMNS,
  PR_ITEM_GRID_OVERLAY_PLACEHOLDERS,
  PR_INFORM_GRID_COLUMNS,
} from './grids/purchase-request-grid.columns';
import {
  prExpectField,
  prExpectFieldContains,
  prExpectFieldMatch,
  prExpectInformToRow,
  prExpectItemRowField,
} from './purchase-request.assert.messages';

async function expectSuggestionValue(page: Page, label: string, expected: string): Promise<void> {
  const input = getInputsByLabel(page, label);
  await expect(input, prExpectFieldMatch(label, expected)).toHaveValue(
    new RegExp(escapeRegex(expected), 'i'),
  );
}

async function expectDateValue(page: Page, label: string, isoDate: string): Promise<void> {
  const [year, month, day] = isoDate.split('-');
  const actual = await getFieldValue(page, label);

  expect(actual, prExpectFieldContains(label, year)).toContain(year);
  expect(actual, prExpectFieldMatch(label, month)).toMatch(new RegExp(`0?${Number(month)}|${month}`));
  expect(actual, prExpectFieldMatch(label, day)).toMatch(new RegExp(`0?${Number(day)}|${day}`));
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isContactNumberFill(
  value: string | ContactNumberFill,
): value is ContactNumberFill {
  return typeof value === 'object' && value !== null && 'localNumber' in value;
}

/**
 * Asserts edit form still shows values from a prior save (`PurchaseRequestFillData`).
 */
export async function expectPurchaseRequestForm(
  page: Page,
  expected: PurchaseRequestFillData,
): Promise<void> {
  if (expected.company) {
    await expectSuggestionValue(page, DOCUMENT_DETAIL_LABELS.company, expected.company.value);
  }
  if (expected.division) {
    await expectSuggestionValue(page, DOCUMENT_DETAIL_LABELS.division, expected.division.value);
  }
  if (expected.documentType) {
    await expectSuggestionValue(page, DOCUMENT_DETAIL_LABELS.documentType, expected.documentType.value);
  }
  if (expected.documentDate) {
    await expectDateValue(page, DOCUMENT_DETAIL_LABELS.documentDate, expected.documentDate);
  }
  if (expected.documentNo) {
    await expect(
      page.locator(`label:has-text("${DOCUMENT_DETAIL_LABELS.documentNo}")`),
      prExpectField(DOCUMENT_DETAIL_LABELS.documentNo, 'visible'),
    ).toBeVisible();
    const docNo = await getFieldValue(page, DOCUMENT_DETAIL_LABELS.documentNo);
    expect(docNo.length, prExpectField(DOCUMENT_DETAIL_LABELS.documentNo, 'non-empty')).toBeGreaterThan(0);
  }

  if (expected.department) {
    await expectSuggestionValue(page, GENERAL_DETAIL_LABELS.department, expected.department.value);
  }
  if (expected.expenditureType) {
    const select = getInputsByLabel(page, GENERAL_DETAIL_LABELS.expenditureType);
    const tagName = await select.evaluate((el) => el.tagName.toLowerCase()).catch(() => '');
    if (tagName === 'select') {
      await expect(select, prExpectFieldMatch(GENERAL_DETAIL_LABELS.expenditureType, expected.expenditureType))
        .toHaveValue(new RegExp(escapeRegex(expected.expenditureType), 'i'));
    } else {
      await expect(select, prExpectFieldMatch(GENERAL_DETAIL_LABELS.expenditureType, expected.expenditureType))
        .toContainText(new RegExp(escapeRegex(expected.expenditureType), 'i'));
    }
  }
  if (expected.requestedBy) {
    await expectSuggestionValue(page, GENERAL_DETAIL_LABELS.requestedBy, expected.requestedBy.value);
  }
  if (expected.requestedByEmail) {
    await expect(
      getInputsByLabel(page, GENERAL_DETAIL_LABELS.requestedByEmail),
      prExpectField(GENERAL_DETAIL_LABELS.requestedByEmail, expected.requestedByEmail),
    ).toHaveValue(expected.requestedByEmail);
  }
  if (expected.requestedContactNo) {
    const local = isContactNumberFill(expected.requestedContactNo)
      ? expected.requestedContactNo.localNumber
      : expected.requestedContactNo;
    const actual = await readContactLocalNumber(page, GENERAL_DETAIL_LABELS.requestedContactNo);
    expect(actual, prExpectField(GENERAL_DETAIL_LABELS.requestedContactNo, local)).toBe(local);
  }
  if (expected.referenceNo) {
    await expect(
      getInputsByLabel(page, GENERAL_DETAIL_LABELS.referenceNo),
      prExpectField(GENERAL_DETAIL_LABELS.referenceNo, expected.referenceNo),
    ).toHaveValue(expected.referenceNo);
  }
  if (expected.referenceDate) {
    await expectDateValue(page, GENERAL_DETAIL_LABELS.referenceDate, expected.referenceDate);
  }
  if (expected.remarks) {
    await expect(
      getInputsByLabel(page, GENERAL_DETAIL_LABELS.remarks),
      prExpectField(GENERAL_DETAIL_LABELS.remarks, expected.remarks),
    ).toHaveValue(expected.remarks);
  }

  const itemTable = new DataCellTable(page, PR_ITEM_GRID_COLUMNS);
  if (expected.itemRows?.length) {
    for (let i = 0; i < expected.itemRows.length; i++) {
      const row = expected.itemRows[i];
      if (row.item) {
        const itemText = await itemTable.readSpanText(i, 'itemName');
        expect(itemText, prExpectItemRowField(i, 'Item Name', row.item.value)).toMatch(
          new RegExp(escapeRegex(row.item.value), 'i'),
        );
      }
      if (row.requiredQty) {
        const actual = await itemTable.readInputValue(i, 'requiredQty');
        expect(actual, prExpectItemRowField(i, 'Required Qty.', row.requiredQty)).toBe(row.requiredQty);
      }
      if (row.prQty) {
        const actual = await itemTable.readInputValue(i, 'prQty');
        expect(actual, prExpectItemRowField(i, 'Pur. Req. Qty.', row.prQty)).toBe(row.prQty);
      }
      if (row.rate) {
        const actual = await itemTable.readInputValue(i, 'rate');
        expect(actual, prExpectItemRowField(i, 'Rate', row.rate)).toBe(row.rate);
      }
      if (row.techSpecification) {
        const techSpec = await itemTable.readTextareaOverlayCell(
          i,
          'techSpecification',
          PR_ITEM_GRID_OVERLAY_PLACEHOLDERS.techSpecification,
        );
        expect(techSpec, prExpectItemRowField(i, 'Tech. Spec.', row.techSpecification)).toBe(
          row.techSpecification,
        );
      }
      if (row.remarks) {
        const remarks = await itemTable.readTextareaOverlayCell(
          i,
          'remarks',
          PR_ITEM_GRID_OVERLAY_PLACEHOLDERS.remarks,
        );
        expect(remarks, prExpectItemRowField(i, 'Remarks', row.remarks)).toBe(row.remarks);
      }
      if (row.costCenter) {
        const costCenter = await itemTable.readSpanText(i, 'costCenterName');
        expect(costCenter, prExpectItemRowField(i, 'Cost Center', row.costCenter.value)).toMatch(
          new RegExp(escapeRegex(row.costCenter.value), 'i'),
        );
      }
      if (row.priority) {
        const priority = await itemTable.readSpanText(i, 'priorityId');
        expect(priority, prExpectItemRowField(i, 'Priority', row.priority.value)).toMatch(
          new RegExp(escapeRegex(row.priority.value), 'i'),
        );
      }
      if (row.scheduleDate) {
        const schedule = await itemTable.readSpanText(i, 'scheduleDate');
        expect(schedule, prExpectItemRowField(i, 'Schedule', '2026')).toContain('2026');
      }
    }
  }

  const informTable = new DataCellTable(page, PR_INFORM_GRID_COLUMNS);
  if (expected.informToRows?.length) {
    for (let i = 0; i < expected.informToRows.length; i++) {
      const person = await informTable.readSpanText(i, 'userName');
      expect(person, prExpectInformToRow(i, expected.informToRows[i].value)).toMatch(
        new RegExp(escapeRegex(expected.informToRows[i].value), 'i'),
      );
    }
  }
}
