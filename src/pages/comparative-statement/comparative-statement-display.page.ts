import { Page } from '@playwright/test';
import { FormLayoutPage } from '../base/form-layout.page';
import { COMPARATIVE_STATEMENT_ROUTES } from './comparative-statement.constants';

export class ComparativeStatementDisplayPage extends FormLayoutPage {
  constructor(page: Page) {
    super(page, COMPARATIVE_STATEMENT_ROUTES.list());
  }

  async open(id: number | string, role: string = 'company') {
    await this.page.goto(COMPARATIVE_STATEMENT_ROUTES.display(id, role));
    await this.waitForAppReady();
  }

  moreActionsBtn() {
    return this.page.locator('button[title="More Actions"], button[aria-label="More Actions"]').first();
  }

  unauthorizeBtn() {
    return this.page.getByRole('button', { name: /Un-Authorize|Unauthorize/i })
      .or(this.page.getByText(/Un-Authorize|Unauthorize/i))
      .first();
  }

  amendValidityDateBtn() {
    return this.page.getByText(/Amend Validity Date/i).first();
  }

  makeMappingBtn() {
    return this.page.getByText(/Make Mapping/i).first();
  }

  printBtn() {
    return this.page.getByRole('button', { name: /Print/i })
      .or(this.page.getByTitle(/Print/i))
      .first();
  }
}

