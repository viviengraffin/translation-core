import Locale from "@/common/locale.ts";
import TranslationNamespaces from "@/common/namespaces.ts";
import type {
  GetTranslationObjectByLocalesReturns,
  LocaleFormat,
  TranslationObjectByLocale,
} from "@/common/types.ts";

/**
 * Loads translation objects for the requested locales.
 *
 * Supports both locale-based translation objects and namespace-based
 * translation containers.
 *
 * When a locale is not available, it is skipped unless it is the
 * configured fallback locale. In that case, an error is thrown.
 *
 * @typeParam T - Type of the translated value.
 *
 * @param translationByLocale - Translation container to load.
 * @param locales - Locales to load, ordered by priority.
 * @param fallbackLocale - Locale that must be available as a fallback.
 * @returns A promise resolving to the loaded translation objects.
 *
 * @throws {Error} If the fallback locale is not available in the
 * translation container.
 *
 * @example
 * ```ts
 * const translations = await getTranslationObjectByLocales(
 *   translationByLocale,
 *   [new Locale("fr-FR"), new Locale("en")],
 *   "en",
 * );
 * ```
 */
export async function getTranslationObjectByLocales<T>(
  translationByLocale: TranslationObjectByLocale<T> | TranslationNamespaces<T>,
  locales: Locale[],
  fallbackLocale: string,
  localeFormat: LocaleFormat,
): Promise<GetTranslationObjectByLocalesReturns<T>> {
  if (translationByLocale instanceof TranslationNamespaces) {
    return await translationByLocale.resolve(locales, fallbackLocale);
  }

  const filteredLocales = locales.filter((locale) => {
    if (Object.hasOwn(translationByLocale, locale[localeFormat])) {
      return true;
    }

    if (locale[localeFormat] === fallbackLocale) {
      throw new Error(
        `Fallback locale "${fallbackLocale}" does not exist in TranslationObjectByLocale`,
      );
    }

    return false;
  });

  return Promise.all(
    filteredLocales.map(async (locale) =>
      await translationByLocale[locale[localeFormat]]()
    ),
  );
}

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
