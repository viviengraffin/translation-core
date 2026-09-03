import { memoize } from "@/common/memoize.ts";
import { IntlDateTimeFacade } from "@/common/intl/date.ts";
import { IntlNumberFacade } from "@/common/intl/number.ts";
import { IntlPluralFacade } from "@/common/intl/plural.ts";

/**
 * Provides a unified interface for locale-aware internationalization
 * features.
 *
 * The facade exposes helpers for date/time formatting, number formatting,
 * pluralization, relative time formatting, and list formatting.
 *
 * @example
 * ```ts
 * const intl = new IntlFacade("en-US");
 *
 * intl.relative(-2, "day");
 * // "2 days ago"
 *
 * intl.list(["Apple", "Banana", "Orange"]);
 * // "Apple, Banana, and Orange"
 * ```
 */
export default class IntlFacade {
  /**
   * Locale used by the internationalization formatters.
   */
  dateTime: IntlDateTimeFacade;

  /**
   * Provides locale-aware number formatting.
   */
  number: IntlNumberFacade;

  /**
   * Provides locale-aware pluralization.
   */
  plural: IntlPluralFacade;

  /**
   * Creates an internationalization facade for the given locale.
   *
   * @param locale - Locale used by the underlying internationalization
   * formatters.
   *
   * @example
   * ```ts
   * const intl = new IntlFacade("fr-FR");
   * ```
   */
  constructor(protected readonly locale: string) {
    this.dateTime = new IntlDateTimeFacade(locale);
    this.number = new IntlNumberFacade(locale);
    this.plural = new IntlPluralFacade(locale);
  }

  @memoize()
  protected get relativeTime(): Intl.RelativeTimeFormat {
    return new Intl.RelativeTimeFormat(this.locale);
  }

  /**
   * Formats a numeric value as a localized relative time.
   *
   * @param value - Numeric value representing the relative amount.
   * @param unit - Unit of the relative time.
   * @returns The localized relative time string.
   *
   * @example
   * ```ts
   * const intl = new IntlFacade("en-US");
   *
   * intl.relative(-1, "day");
   * // "yesterday"
   *
   * intl.relative(3, "hour");
   * // "in 3 hours"
   * ```
   */
  relative(
    value: number,
    unit: Intl.RelativeTimeFormatUnit,
  ): string {
    return this.relativeTime.format(value, unit);
  }

  /**
   * Formats a list of values according to the current locale.
   *
   * @param values - Values to format.
   * @param options - Options passed to {@link Intl.ListFormat}.
   * @returns The localized formatted list.
   *
   * @example
   * ```ts
   * const intl = new IntlFacade("en-US");
   *
   * intl.list(["Apple", "Banana", "Orange"]);
   * // "Apple, Banana, and Orange"
   * ```
   */
  list(
    values: string[] | Set<string>,
    options?: Intl.ListFormatOptions,
  ): string {
    return new Intl.ListFormat(this.locale, options).format(values);
  }
}
