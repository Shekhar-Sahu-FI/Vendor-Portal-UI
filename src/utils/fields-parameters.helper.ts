import { expect, Locator } from '@playwright/test';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'numeric'
  | 'decimal'
  | 'format';

export interface FieldConstraints {
  fieldName: string;
  type: FieldType;
  maxLength?: number;
  maxIntegerDigits?: number;
  maxDecimalDigits?: number;
  allowNegative?: boolean;
  regex?: RegExp;
}

export async function validateField(
  field: Locator,
  constraints: FieldConstraints
) {
  const {
    fieldName,
    type,
    maxLength,
    maxIntegerDigits,
    maxDecimalDigits,
    allowNegative = false,
    regex
  } = constraints;

  console.log(`Validating ${fieldName}`);

  switch (type) {
    case 'text':
    case 'textarea': {
      if (!maxLength) return;

      const value = 'A'.repeat(maxLength + 10);

      await field.clear();
      await field.fill(value);

      const actual = await field.inputValue();

      expect(actual.length).toBeLessThanOrEqual(maxLength);

      console.log(
        `${fieldName}: Accepted Length = ${actual.length}`
      );
      break;
    }

    case 'numeric': {
      if (!maxIntegerDigits) return;

      const value = '9'.repeat(maxIntegerDigits + 5);

      await field.clear();
      await field.fill(value);

      const actual = await field.inputValue();

      const digits = actual.replace(/\D/g, '');

      expect(digits.length).toBeLessThanOrEqual(maxIntegerDigits);

      console.log(
        `${fieldName}: Accepted Digits = ${digits.length}`
      );

      if (!allowNegative) {
        await field.clear();
        await field.fill('-123');

        expect(await field.inputValue()).not.toContain('-');
      }

      break;
    }

    case 'decimal': {
      const integerPart = '9'.repeat(
        (maxIntegerDigits ?? 10) + 5
      );

      const decimalPart = '1'.repeat(
        (maxDecimalDigits ?? 4) + 5
      );

      await field.clear();
      await field.fill(`${integerPart}.${decimalPart}`);

      const actual = await field.inputValue();

      console.log(`${fieldName}: ${actual}`);

      if (actual.includes('.')) {
        const [intPart, decPart] = actual.split('.');

        if (maxIntegerDigits) {
          expect(intPart.length).toBeLessThanOrEqual(
            maxIntegerDigits
          );
        }

        if (maxDecimalDigits) {
          expect(decPart.length).toBeLessThanOrEqual(
            maxDecimalDigits
          );
        }
      }

      break;
    }

    case 'format': {
      if (!regex) return;

      const actual = await field.inputValue();

      expect(actual).toMatch(regex);           

      break;
    }
  }
}