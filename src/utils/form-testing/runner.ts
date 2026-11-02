import { expect, Page } from '@playwright/test';
import type { TestInfo } from '@playwright/test';
import {
  assertValidationExpectations,
  expectSaveNotConfirmed,
} from './validation.helpers';
import type { FormCheck, FormCheckContext, FormCheckResult, ValidationScenario } from './types';
import { formatFormCheckReport, runFormChecks } from './limit.helpers';

export async function runValidationScenario(
  page: Page,
  scenario: ValidationScenario,
): Promise<void> {
  const ctx: FormCheckContext = { page, triggerSave: scenario.save };
  if (scenario.setup) await scenario.setup(ctx);
  await scenario.save();
  if (scenario.stayOnUrl) {
    await expect(page).toHaveURL(scenario.stayOnUrl);
  }
  await expectSaveNotConfirmed(page);
  await assertValidationExpectations(page, scenario.expect);
}

export type ScenarioRunResult = {
  name: string;
  status: 'pass' | 'fail';
  detail?: string;
};

/** Runs scenarios one by one; failures do not stop the rest. */
export async function runValidationScenarios(
  page: Page,
  scenarios: ValidationScenario[],
): Promise<ScenarioRunResult[]> {
  const results: ScenarioRunResult[] = [];

  for (const scenario of scenarios) {
    try {
      await runValidationScenario(page, scenario);
      results.push({ name: scenario.name, status: 'pass' });
    } catch (error) {
      results.push({
        name: scenario.name,
        status: 'fail',
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

export async function publishFormCheckReport(
  testInfo: TestInfo,
  title: string,
  results: FormCheckResult[] | ScenarioRunResult[],
): Promise<string> {
  const isLimit = results.length > 0 && 'limit' in results[0];
  const text = isLimit
    ? formatFormCheckReport(title, results as FormCheckResult[])
    : formatScenarioReport(title, results as ScenarioRunResult[]);

  console.log(`\n${text}\n`);
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  await testInfo.attach(`${slug}.txt`, { body: text, contentType: 'text/plain' });
  await testInfo.attach(`${slug}.json`, {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });
  return text;
}

function formatScenarioReport(title: string, results: ScenarioRunResult[]): string {
  const lines = [title, '─'.repeat(60)];
  for (const r of results) {
    lines.push(`${r.status === 'pass' ? 'PASS' : 'FAIL'} | ${r.name}`);
    if (r.detail) lines.push(`  → ${r.detail}`);
  }
  const passed = results.filter((r) => r.status === 'pass').length;
  lines.push('─'.repeat(60));
  lines.push(`Total ${results.length} | Passed ${passed} | Failed ${results.length - passed}`);
  return lines.join('\n');
}

export function assertAllPassed(
  results: Array<{ status: 'pass' | 'fail' }>,
  report: string,
): void {
  const failures = results.filter((r) => r.status === 'fail');
  expect(failures, `\n${report}\n`).toHaveLength(0);
}

export async function runLimitChecks(
  checks: FormCheck[],
  ctx: FormCheckContext,
): Promise<FormCheckResult[]> {
  return runFormChecks(checks, ctx);
}
