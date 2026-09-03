import {
  DEFAULT_FALLBACK_LOCALE,
  DEFAULT_LOCALE_FORMAT,
} from "@/common/const.ts";
import type TranslationNamespaces from "@/common/namespaces.ts";
import type {
  GetTranslationsLocalesOptions,
  Loader,
  TranslationObjectByLocale,
} from "@/common/types.ts";
import { getTranslationObjectByLocales, toLocalArray } from "@/common/utils.ts";

/**
 * Creates a translation loader using a custom locale source.
 *
 * The locale loader is called each time translations are loaded, allowing
 * locales to be dynamically determined from any available source, such as
 * browser settings, local storage, cookies, or application state.
 *
 * The returned loader combines the explicitly requested locale, the locales
 * returned by `localeLoader`, and the fallback locale. Duplicate locales are
 * removed before loading the translations.
 *
 * @typeParam T - Type of the translated value.
 *
 * @param localeLoader - Function used to dynamically retrieve the locales
 * to consider when loading translations. Defaults to an empty list.
 * @returns A translation loader compatible with {@link Loader}.
 *
 * @example
 * ```ts
 * const loader = getTranslationObjects(() => {
 *   const locale = localStorage.getItem("locale");
 *
 *   return locale ? [locale] : [];
 * });
 * ```
 *
 * @remarks
 * The locale resolution order is:
 *
 * 1. The explicitly provided locale, if any.
 * 2. The locales returned by `localeLoader`.
 * 3. The fallback locale.
 *
 * The resulting locales are deduplicated before the translations are loaded.
 */
export function createLoader<T>(
  localeLoader: () => string[] = () => [],
): Loader<T> {
  return async function (
    translations: TranslationObjectByLocale<T> | TranslationNamespaces<T>,
    {
      locale,
      fallbackLocale = DEFAULT_FALLBACK_LOCALE,
      localeFormat = DEFAULT_LOCALE_FORMAT,
    }: GetTranslationsLocalesOptions = {},
  ) {
    const locales = toLocalArray([
      ...new Set([
        ...(locale ? [locale] : []),
        ...localeLoader(),
        fallbackLocale,
      ]),
    ]);

    return await getTranslationObjectByLocales(
      translations,
      locales,
      fallbackLocale,
      localeFormat,
    );
  };
}
