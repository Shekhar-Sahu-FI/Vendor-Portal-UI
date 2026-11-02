import type { Page } from '@playwright/test';

export type FormCheckResult = {
  id: string;
  section: string;
  label: string;
  limit: string;
  status: 'pass' | 'fail';
  detail?: string;
};

export type FormCheckContext = {
  page: Page;
  triggerSave: () => Promise<void>;
};

/** Returns error text when failed, or null when passed. */
export type FormCheckFn = (ctx: FormCheckContext) => Promise<string | null>;

export type FormCheck = {
  id: string;
  section: string;
  label: string;
  limit: string;
  run: FormCheckFn;
};

export type ValidationExpectation = {
  messages?: Array<string | RegExp>;
  fields?: Array<{ label: string; message: string | RegExp }>;
  gridSummary?: Array<string | RegExp>;
  gridCells?: Array<{ row: number; columnId: string; message: string | RegExp }>;
};

export type ValidationScenario = {
  name: string;
  setup?: (ctx: FormCheckContext) => Promise<void>;
  save: () => Promise<void>;
  stayOnUrl?: RegExp;
  expect: ValidationExpectation;
};
