import { memoize } from "@/common/memoize.ts";

type DateTimeValue =
  | Date
  | Temporal.Instant
  | Temporal.PlainDate
  | Temporal.PlainDateTime;

/**
 * Provides locale-aware date and time formatting.
 *
 * The formatter uses the locale provided at construction time and exposes
 * several commonly used date and date-time formats.
 *
 * @example
 * ```ts
 * const dateTime = new IntlDateTimeFacade("en-US");
 *
 * dateTime.date(new Date("2026-08-31"));
 * // "8/31/2026"
 *
 * dateTime.long(new Date("2026-08-31"));
 * // "August 31"
 * ```
 */
export class IntlDateTimeFacade {
  /**
   * Creates a date/time formatter for the given locale.
   *
   * @param locale - Locale used for formatting.
   *
   * @example
   * ```ts
   * const dateTime = new IntlDateTimeFacade("fr-FR");
   * ```
   */
  constructor(protected readonly locale: string) {}

  @memoize("salut")
  get dateFormatter(): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(this.locale);
  }

  @memoize()
  get longFormatter(): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(this.locale, { month: "long" });
  }

  @memoize()
  get year2DigitsFormatter(): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(this.locale, { year: "2-digit" });
  }

  @memoize()
  get dateTimeFormatter(): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(this.locale, {
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Formats a date using the locale's default date format.
   *
   * @param date - Date or Temporal value to format.
   * @returns The localized date string.
   *
   * @example
   * ```ts
   * const dateTime = new IntlDateTimeFacade("en-US");
   *
   * dateTime.date(new Date("2026-08-31"));
   * // "8/31/2026"
   * ```
   */
  date(date: DateTimeValue): string {
    return this.dateFormatter.format(date);
  }

  /**
   * Formats a date using a long month name.
   *
   * @param date - Date or Temporal value to format.
   * @returns The localized date string with a long month name.
   *
   * @example
   * ```ts
   * const dateTime = new IntlDateTimeFacade("en-US");
   *
   * dateTime.long(new Date("2026-08-31"));
   * // "August 31"
   * ```
   */
  long(date: DateTimeValue): string {
    return this.longFormatter.format(date);
  }

  /**
   * Formats a date using a two-digit year.
   *
   * @param date - Date or Temporal value to format.
   * @returns The localized date string with a two-digit year.
   *
   * @example
   * ```ts
   * const dateTime = new IntlDateTimeFacade("en-US");
   *
   * dateTime.year2Digits(new Date("2026-08-31"));
   * // "8/31/26"
   * ```
   */
  year2Digits(date: DateTimeValue): string {
    return this.year2DigitsFormatter.format(date);
  }

  /**
   * Formats a date and time using a long month name and two-digit
   * hour and minute values.
   *
   * @param date - Date or Temporal value to format.
   * @returns The localized date and time string.
   *
   * @example
   * ```ts
   * const dateTime = new IntlDateTimeFacade("en-US");
   *
   * dateTime.dateTime(new Date("2026-08-31T14:30:00"));
   * // "August 31 at 2:30 PM"
   * ```
   *
   * @remarks
   * Unlike {@link date}, {@link long}, and {@link year2Digits}, this method
   * does not accept {@link Temporal.PlainDate} because a date without a
   * time cannot be formatted using the date-time formatter.
   */
  dateTime(
    date: Exclude<DateTimeValue, Temporal.PlainDate>,
  ): string {
    return this.dateTimeFormatter.format(date);
  }
}
