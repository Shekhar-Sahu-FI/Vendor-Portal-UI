import { Locator, Page, expect } from '@playwright/test';

type ParsedDate = {
  day: number;
  month: number;
  year: number;
  monthYearLabel: string;
};

/**
 * Parses YYYY-MM-DD as local calendar date (avoids UTC timezone shifts).
 */
function parseTargetDate(targetDate: string | Date): ParsedDate {
  if (typeof targetDate === 'string') {
    const trimmed = targetDate.trim();

    // Match YYYY-MM-DD or YYYY/MM/DD
    const isoMatch = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/.exec(trimmed);
    if (isoMatch) {
      const year = Number(isoMatch[1]);
      const month = Number(isoMatch[2]) - 1;
      const day = Number(isoMatch[3]);
      const local = new Date(year, month, day);
      return {
        day,
        month,
        year,
        monthYearLabel: local.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      };
    }

    // Match DD-MM-YYYY or DD/MM/YYYY
    const dmyMatch = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/.exec(trimmed);
    if (dmyMatch) {
      const day = Number(dmyMatch[1]);
      const month = Number(dmyMatch[2]) - 1;
      const year = Number(dmyMatch[3]);
      const local = new Date(year, month, day);
      return {
        day,
        month,
        year,
        monthYearLabel: local.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      };
    }
  }

  const date = targetDate instanceof Date ? targetDate : new Date(targetDate);
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
    monthYearLabel: date.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
  };
}

/**
 * Returns the field container for a labeled control (closest ancestor enclosing label and input/button).
 */
export function getLabeledFieldContainer(page: Page, labelText: string): Locator {
  const cleanLabel = labelText.trim();
  return page
    .locator(`label:has-text("${cleanLabel}")`)
    .first()
    .locator('xpath=ancestor::div[contains(@class, "flex-col") or .//button or .//input or .//select][1]');
}

/**
 * Calendar button beside a labeled date input.
 */
export function getDatePickerButton(page: Page, labelText: string): Locator {
  const container = getLabeledFieldContainer(page, labelText);
  return container.locator('button:has(svg), button').last();
}

/**
 * Returns the locator for the open calendar dropdown.
 */
export function getCalendarLocator(page: Page, calendarContainer?: Locator): Locator {
  return (
    calendarContainer ??
    page.locator('.z-dropdown:has(.grid.grid-cols-7), div:has(.grid.grid-cols-7)').last()
  );
}

/**
 * Navigates the shared calendar popover and selects the target day.
 * Only clicks days in the displayed month (excludes adjacent-month padding with text-muted-foreground).
 */
export async function selectDateFromCalendar(
  page: Page,
  targetDate: string | Date,
  calendarContainer?: Locator,
): Promise<void> {
  const { day: targetDay, month: targetMonth, year: targetYear, monthYearLabel } =
    parseTargetDate(targetDate);

  const calendar = getCalendarLocator(page, calendarContainer);

  await expect(calendar).toBeVisible({ timeout: 10_000 });

  const monthHeader = calendar.locator('span.text-sm.font-bold').first();
  const prevButton = calendar.locator('button').nth(0);
  const nextButton = calendar.locator('button').nth(1);

  for (let i = 0; i < 36; i++) {
    const currentMonthYear = (await monthHeader.textContent())?.trim();
    if (currentMonthYear === monthYearLabel) {
      break;
    }

    const currentMonthYearParts = currentMonthYear?.split(/\s+/) ?? [];
    if (currentMonthYearParts.length >= 2) {
      const currentMonth = new Date(
        `${currentMonthYearParts[0]} 1, ${currentMonthYearParts[1]}`,
      ).getMonth();
      const currentYear = parseInt(currentMonthYearParts[1] ?? '0', 10);

      const currentDate = new Date(currentYear, currentMonth, 1);
      const targetDateForComparison = new Date(targetYear, targetMonth, 1);

      if (currentDate > targetDateForComparison) {
        await prevButton.click();
      } else {
        await nextButton.click();
      }
      await page.waitForTimeout(100);
    }
  }

  await expect(monthHeader).toHaveText(monthYearLabel, { timeout: 5_000 });

  const dayCell = calendar
    .locator('div.h-8.w-8:not([class*="text-muted-foreground"]):not([class*="text-gray-300"])')
    .filter({ hasText: new RegExp(`^\\s*${targetDay}\\s*$`) })
    .first();

  await expect(dayCell).toBeVisible({ timeout: 5_000 });
  await dayCell.click();

  const setTimeBtn = calendar.locator('button:has-text("Set Time")');
  if (await setTimeBtn.isVisible({ timeout: 1_000 }).catch(() => false)) {
    await setTimeBtn.click();
  }

  await calendar.waitFor({ state: 'hidden', timeout: 3_000 }).catch(() => {
    // calendar closed or unmounted
  });
}

/**
 * Opens a labeled date field picker and selects a date from the calendar UI.
 */
export async function fillDateByLabel(
  page: Page,
  labelText: string,
  targetDate: string | Date,
  calendarContainer?: Locator,
): Promise<void> {
  const calendar = getCalendarLocator(page, calendarContainer);

  const isAlreadyOpen = await calendar.isVisible().catch(() => false);
  if (!isAlreadyOpen) {
    const pickerButton = getDatePickerButton(page, labelText);
    await pickerButton.scrollIntoViewIfNeeded();
    await expect(pickerButton).toBeVisible({ timeout: 10_000 });
    await pickerButton.click();
    const opened = await calendar.isVisible({ timeout: 1_500 }).catch(() => false);
    if (!opened) {
      await pickerButton.click();
    }
  }

  await selectDateFromCalendar(page, targetDate, calendarContainer);
}
