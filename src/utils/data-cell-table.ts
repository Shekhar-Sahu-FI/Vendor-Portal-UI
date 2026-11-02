import { Locator, Page, expect } from '@playwright/test';
import { selectFromAutoSuggestion } from './auto-suggestion.helper';
import { getCalendarLocator, selectDateFromCalendar } from './date-calendar.helper';
import { TextAreaOverlayHelper } from './textarea-overlay.helper';

/**
 * Table bound to `data-cell-id="{prefix}-{rowIndex}-{segment}"` grids.
 * All cell helpers take `rowIndex` first.
 */
export class DataCellTable<const TCols extends Readonly<Record<string, string>>> {
  constructor(
    readonly page: Page,
    readonly columns: TCols,
    readonly cellIdPrefix: string = 'cell',
  ) {}

  private segment<K extends keyof TCols>(column: K): string {
    return this.columns[column];
  }

  cell<K extends keyof TCols>(rowIndex: number, column: K): Locator {
    const id = `${this.cellIdPrefix}-${rowIndex}-${this.segment(column)}`;
    return this.page.locator(`[data-cell-id="${id}"]`);
  }

  span<K extends keyof TCols>(rowIndex: number, column: K): Locator {
    return this.cell(rowIndex, column).locator('span').first();
  }

  input<K extends keyof TCols>(rowIndex: number, column: K): Locator {
    return this.cell(rowIndex, column).locator('input').first();
  }

  async scrollCellIntoView<K extends keyof TCols>(rowIndex: number, column: K): Promise<void> {
    await this.cell(rowIndex, column).scrollIntoViewIfNeeded();
  }

  async fillInput<K extends keyof TCols>(rowIndex: number, column: K, value: string): Promise<void> {
    await this.scrollCellIntoView(rowIndex, column);
    await this.cell(rowIndex, column).click();
    const el = this.input(rowIndex, column);
    await el.fill('');
    await el.type(value, { delay: 50 });
    await el.press('Enter');
    await el.evaluate((input: HTMLInputElement) => input.blur()).catch(() => {});
  }

  /**
   * Opens the cell date picker and selects a day via the shared calendar UI.
   */
  async selectDateInCell<K extends keyof TCols>(
    rowIndex: number,
    column: K,
    targetDate: string | Date,
    calendarContainer?: Locator,
  ): Promise<void> {
    await this.scrollCellIntoView(rowIndex, column);
    const cell = this.cell(rowIndex, column);
    const calendar = getCalendarLocator(this.page, calendarContainer);

    const isAlreadyOpen = await calendar.isVisible().catch(() => false);
    if (!isAlreadyOpen) {
      const button = cell.locator('button:has(svg), button').last();
      await button.scrollIntoViewIfNeeded();
      await expect(button).toBeVisible({ timeout: 10_000 });
      await button.click();

      const opened = await calendar.isVisible({ timeout: 1_500 }).catch(() => false);
      if (!opened) {
        const input = cell.locator('input').first();
        if (await input.isVisible().catch(() => false)) {
          await input.focus();
          await input.press('Enter');
        }
        const openedViaEnter = await calendar.isVisible({ timeout: 1_500 }).catch(() => false);
        if (!openedViaEnter) {
          await button.click({ force: true });
        }
      }
    }

    await selectDateFromCalendar(this.page, targetDate, calendarContainer);
  }

  /**
   * Opens the cell editor button, fills the overlay textarea (`.uc-overlaypanel`), and saves.
   */
  async fillTextareaOverlayCell<K extends keyof TCols>(
    rowIndex: number,
    column: K,
    value: string,
    overlayTextareaPlaceholder: string = ''
    ): Promise<void> {
    await this.scrollCellIntoView(rowIndex, column);
    const cell = this.cell(rowIndex, column);
    await cell.getByRole('button').first().click();
    const overlay = new TextAreaOverlayHelper(this.page);
    await overlay.waitForVisible(overlayTextareaPlaceholder);
    await overlay.enterTextAndSave(value, overlayTextareaPlaceholder);
  }

  async selectSuggestion<K extends keyof TCols>(
    rowIndex: number,
    column: K,
    query: string,
    value: string,
    inputIndex: number = 0,
  ): Promise<void> {
    await this.scrollCellIntoView(rowIndex, column);
    await this.cell(rowIndex, column).click();
    await selectFromAutoSuggestion(
      this.page,
      this.cell(rowIndex, column).locator('input'),
      query,
      value,
      inputIndex,
    );
  }

  async readSpanText<K extends keyof TCols>(rowIndex: number, column: K): Promise<string> {
    return ((await this.span(rowIndex, column).textContent()) ?? '').trim();
  }

  async readInputValue<K extends keyof TCols>(rowIndex: number, column: K): Promise<string> {
    return this.input(rowIndex, column).inputValue();
  }

  async readTextareaOverlayCell<K extends keyof TCols>(
    rowIndex: number,
    column: K,
    overlayTextareaPlaceholder: string = '',
  ): Promise<string> {
    await this.scrollCellIntoView(rowIndex, column);
    await this.cell(rowIndex, column).getByRole('button').first().click();
    const overlay = new TextAreaOverlayHelper(this.page);
    await overlay.waitForVisible(overlayTextareaPlaceholder);
    let target = overlay.textareaWithoutPlaceholder();
    if (overlayTextareaPlaceholder && (await overlay.textarea(overlayTextareaPlaceholder).count())) {
      target = overlay.textarea(overlayTextareaPlaceholder);
    }
    const value = await target.inputValue();
    await this.page.keyboard.press('Escape');
    return value;
  }

  async clickInCell<K extends keyof TCols>(
    rowIndex: number,
    column: K,
    selector: string,
  ): Promise<void> {
    await this.cell(rowIndex, column).locator(selector).click();
  }
}
