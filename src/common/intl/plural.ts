import { memoize } from "@/common/memoize.ts";
import type { PluralVariants } from "@/common/types.ts";

/**
 * Provides locale-aware pluralization.
 *
 * Supports both cardinal pluralization, used for quantities, and ordinal
 * pluralization, used for ordered values.
 *
 * @example
 * ```ts
 * const plural = new IntlPluralFacade("en-US");
 *
 * plural.cardinal(1, {
 *   one: "apple",
 *   other: "apples",
 * });
 * // "apple"
 *
 * plural.cardinal(3, {
 *   one: "apple",
 *   other: "apples",
 * });
 * // "apples"
 *
 * plural.ordinal(1, {
 *   one: "st",
 *   two: "nd",
 *   few: "rd",
 *   other: "th",
 * });
 * // "st"
 * ```
 */
export class IntlPluralFacade {
  /**
   * Creates a pluralization facade for the given locale.
   *
   * @param locale - Locale used to determine pluralization rules.
   *
   * @example
   * ```ts
   * const plural = new IntlPluralFacade("fr-FR");
   * ```
   */
  constructor(protected locale: string) {}

  @memoize()
  protected get cardinalFormatter(): Intl.PluralRules {
    return new Intl.PluralRules(this.locale, { type: "cardinal" });
  }

  @memoize()
  protected get ordinalFormatter(): Intl.PluralRules {
    return new Intl.PluralRules(this.locale, { type: "ordinal" });
  }

  /**
   * Selects the appropriate plural variant for a quantity.
   *
   * Uses the locale's cardinal pluralization rules, which are intended
   * for quantities and counts.
   *
   * If the locale does not produce a key present in `words`, the `other`
   * variant is returned.
   *
   * @typeParam T - Type of the pluralized value.
   *
   * @param quantity - Quantity used to determine the plural category.
   * @param words - Values associated with each plural category.
   * @returns The value corresponding to the selected plural category.
   *
   * @example
   * ```ts
   * const plural = new IntlPluralFacade("en-US");
   *
   * plural.cardinal(1, {
   *   one: "message",
   *   other: "messages",
   * });
   * // "message"
   *
   * plural.cardinal(5, {
   *   one: "message",
   *   other: "messages",
   * });
   * // "messages"
   * ```
   */
  cardinal<T>(quantity: number, words: PluralVariants<T>): T {
    const key = this.cardinalFormatter.select(quantity);

    return words[key] ?? words.other;
  }

  /**
   * Selects the appropriate plural variant for an ordinal value.
   *
   * Uses the locale's ordinal pluralization rules, which are intended
   * for values representing an order or position.
   *
   * If the locale does not produce a key present in `words`, the `other`
   * variant is returned.
   *
   * @typeParam T - Type of the pluralized value.
   *
   * @param quantity - Value used to determine the ordinal category.
   * @param words - Values associated with each plural category.
   * @returns The value corresponding to the selected plural category.
   *
   * @example
   * ```ts
   * const plural = new IntlPluralFacade("en-US");
   *
   * plural.ordinal(1, {
   *   one: "st",
   *   two: "nd",
   *   few: "rd",
   *   other: "th",
   * });
   * // "st"
   *
   * plural.ordinal(2, {
   *   one: "st",
   *   two: "nd",
   *   few: "rd",
   *   other: "th",
   * });
   * // "nd"
   * ```
   */
  ordinal<T>(quantity: number, words: PluralVariants<T>): T {
    const key = this.ordinalFormatter.select(quantity);

    return words[key] ?? words.other;
  }
}
