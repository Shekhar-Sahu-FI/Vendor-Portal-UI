import fs from 'fs';
import path from 'path';

const ASSETS_DIR = path.resolve(__dirname, '../../test-assets');

/**
 * Resolves a committed file under playwright/test-assets.
 */
export function attachmentAsset(fileName: string): string {
  const fullPath = path.join(ASSETS_DIR, fileName);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing attachment test asset: ${fullPath}`);
  }
  return fullPath;
}

/**
 * Creates a temporary file larger than maxBytes for size-validation tests.
 */
export function createOversizedTempFile(maxBytes: number, fileName = 'oversized.bin'): string {
  const dir = path.join(ASSETS_DIR, '.generated');
  fs.mkdirSync(dir, { recursive: true });
  const fullPath = path.join(dir, fileName);
  fs.writeFileSync(fullPath, Buffer.alloc(maxBytes + 1024, 0x61));
  return fullPath;
}
