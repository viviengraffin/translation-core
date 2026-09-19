import Locale from "@/common/locale.ts";

/**
 * Converts an array of locale strings into {@link Locale} instances.
 *
 * @param locales - Locale strings to convert.
 * @returns An array of {@link Locale} instances.
 *
 * @example
 * ```ts
 * const locales = toLocalArray(["fr-FR", "en-US"]);
 *
 * locales[0].dash; // "fr-FR"
 * locales[0].underscore; // "fr_FR"
 * ```
 */
export function toLocalArray(locales: string[]): Locale[] {
  return locales.map((locale) => new Locale(locale));
}

/**
 * Construct a new array with unique values.
 *
 * @param array Source array
 * @returns Unique array
 */
export function toUniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}
