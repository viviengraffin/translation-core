import { memoize } from "@/common/memoize.ts";

/**
 * Provides locale-aware number formatting.
 *
 * The formatter uses the locale provided at construction time and supports
 * standard numbers, currencies, percentages, and units.
 *
 * @example
 * ```ts
 * const number = new IntlNumberFacade("en-US");
 *
 * number.format(1234567.89);
 * // "1,234,567.89"
 *
 * number.currency(1234.5, "USD");
 * // "$1,234.50"
 *
 * number.unit(10, "kilometer");
 * // "10 km"
 * ```
 */
export class IntlNumberFacade {
  /**
   * Creates a number formatter for the given locale.
   *
   * @param locale - Locale used for number formatting.
   *
   * @example
   * ```ts
   * const number = new IntlNumberFacade("fr-FR");
   * ```
   */
  constructor(protected locale: string) {}

  @memoize()
  protected get normalFormatter(): Intl.NumberFormat {
    return new Intl.NumberFormat(this.locale);
  }

  @memoize()
  protected currencyFormatter(currency: string): Intl.NumberFormat {
    return new Intl.NumberFormat(this.locale, {
      style: "currency",
      currency,
    });
  }

  @memoize()
  protected get percentFormatter(): Intl.NumberFormat {
    return new Intl.NumberFormat(this.locale, {
      style: "percent",
    });
  }

  @memoize()
  protected unitFormatter(unit: string): Intl.NumberFormat {
    return new Intl.NumberFormat(this.locale, {
      style: "unit",
      unit,
    });
  }

  /**
   * Formats a number according to the current locale.
   *
   * @param value - Number to format.
   * @returns The localized number string.
   *
   * @example
   * ```ts
   * const number = new IntlNumberFacade("fr-FR");
   *
   * number.format(1234567.89);
   * // "1 234 567,89"
   * ```
   */
  format(value: number): string {
    return this.normalFormatter.format(value);
  }

  /**
   * Formats a number as a currency.
   *
   * @param value - Amount to format.
   * @param currency - ISO 4217 currency code.
   * @returns The localized currency string.
   *
   * @example
   * ```ts
   * const number = new IntlNumberFacade("en-US");
   *
   * number.currency(1234.5, "USD");
   * // "$1,234.50"
   * ```
   */
  currency(value: number, currency: string): string {
    return this.currencyFormatter(currency).format(value);
  }

  /**
   * Formats a number using the given unit.
   *
   * @param value - Numeric value to format.
   * @param unit - Unit identifier supported by {@link Intl.NumberFormat}.
   * @returns The localized number and unit string.
   *
   * @example
   * ```ts
   * const number = new IntlNumberFacade("en-US");
   *
   * number.unit(10, "kilometer");
   * // "10 km"
   * ```
   */
  unit(value: number, unit: string): string {
    return this.unitFormatter(unit).format(value);
  }

  /**
   * Formats a number as a percentage according to the current locale.
   *
   * @param value - Value to format as a percentage.
   * @returns The localized percentage string.
   *
   * @example
   * ```ts
   * const number = new IntlNumberFacade("en-US");
   *
   * number.percent(0.5);
   * // "50%"
   * ```
   */
  percent(value: number): string {
    return this.percentFormatter.format(value);
  }
}
