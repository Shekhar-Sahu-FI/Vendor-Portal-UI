import { Page } from '@playwright/test';

export const DOC_NUMBER_FIELDS = ['docNoYearly', 'displayDocNoYearly', 'docNo'] as const;

/**
 * Builds the column-filter placeholder used by DataGrid (`Filter {header}...`).
 */
export function columnFilterPlaceholder(columnHeader: string): string {
  return `Filter ${columnHeader}...`;
}



export type SaveCaptureResult = {
  data: any | null;
};

/**
 * Waits for a save API (POST/PUT), runs `saveAction` (click Save + confirm), returns parsed doc number.
 */
export async function captureSaveResponse(
  page: Page,
  saveAction: () => Promise<void>,
  urlPattern: RegExp,
): Promise<SaveCaptureResult> {
  const onResponse = (response: any) => {
    const req = response.request();
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method()) || urlPattern.test(response.url())) {
      console.log(`[API RESPONSE] ${req.method()} ${response.url()} -> ${response.status()} (${response.statusText()})`);
      if (!response.ok()) {
        response.text().then((t: string) => console.log(`[API ERROR BODY] ${t.slice(0, 500)}`)).catch(() => {});
      }
    }
  };
  page.on('response', onResponse);

  const onRequest = (request: any) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method()) || urlPattern.test(request.url())) {
      console.log(`[API REQUEST] ${request.method()} ${request.url()}`);
    }
  };
  page.on('request', onRequest);

  const onConsole = (msg: any) => {
    if (msg.type() === 'error') {
      console.log(`[BROWSER CONSOLE ERROR] ${msg.text()}`);
    }
  };
  page.on('console', onConsole);

  const responsePromise = page.waitForResponse(
    (response) => {
      const match = urlPattern.test(response.url())
        && ['POST', 'PUT'].includes(response.request().method());
      console.log(`[waitForResponse CHECK] URL=${response.url()} method=${response.request().method()} ok=${response.ok()} match=${match}`);
      return match && response.ok();
    },
    { timeout: 90_000 },
  );

  console.log('[captureSaveResponse] calling saveAction...');
  await saveAction();
  console.log('[captureSaveResponse] saveAction completed! Awaiting responsePromise...');
  const response = await responsePromise;
  console.log('[captureSaveResponse] response received!');
  const body = await response.json().catch(() => null);

  page.off('response', onResponse);
  page.off('request', onRequest);
  page.off('console', onConsole);

  return {
    data: body.data,
  };
}
