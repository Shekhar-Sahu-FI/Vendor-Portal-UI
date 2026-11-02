import { Page } from '@playwright/test';
import { MAIL_SUBJECT_LABELS as L } from '../request-for-quotation.constants';
import { fillTextField } from '../../../utils/field-accessor';

export class RequestForQuotationMailSubjectSection {
  constructor(private readonly page: Page) {}

  async fillMailSubject(value: string): Promise<void> {
    await fillTextField(this.page, L.mailSubject, value);
  }
}
