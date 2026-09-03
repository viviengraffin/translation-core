import {
  DEFAULT_FALLBACK_LOCALE,
  DEFAULT_LOCALE_FORMAT,
} from "@/common/const.ts";
import type Locale from "@/common/locale.ts";
import type {
  GetTranslationObjectByLocalesReturns,
  GetTranslationsLocalesOptions,
  TranslationContainer,
} from "@/common/types.ts";
import { getTranslationObjectByLocales, toLocalArray } from "@/common/utils.ts";
import isBrowserEnvironment from "@/environments/frontend/isBrowserEnvironment.ts";

function getLocales(
  locales: string[],
  fallbackLocale: string,
  defaultLocale: string | undefined,
): Locale[] {
  const newLocales = locales.map((locale) => locale.replaceAll("-", "_"));
  const res: Set<string> = defaultLocale
    ? new Set([defaultLocale, ...newLocales, fallbackLocale])
    : new Set([...newLocales, fallbackLocale]);

  return toLocalArray([...res]);
}

/**
 * Loads translation objects based on the user's browser locales.
 *
 * The browser's preferred languages are retrieved from
 * {@link Navigator.languages}, with {@link Navigator.language} used as
 * a fallback. Locale values using `-` as a separator are normalized to
 * use `_`.
 *
 * An explicitly provided locale is given priority, followed by the
 * browser's preferred locales and the fallback locale.
 *
 * @typeParam T - Type of the translated value.
 *
 * @param translationByLocale - Translations organized by locale or
 * namespace.
 * @param options - Locale and fallback configuration.
 * @returns A promise resolving to the translation objects matching the
 * available locale candidates.
 *
 * @throws {Error} If called outside of a browser environment.
 *
 * @example
 * ```ts
 * const translations = await getTranslationObjects(translations, {
 *   locale: "fr_FR",
 *   fallbackLocale: "en",
 * });
 * ```
 *
 * @remarks
 * The locale resolution order is:
 *
 * 1. The explicitly provided locale, if any.
 * 2. The browser's preferred languages from `navigator.languages`.
 * 3. The browser's primary language from `navigator.language`.
 * 4. The configured fallback locale.
 *
 * Duplicate locales are removed before loading the translations.
 */
export async function loader<T>(
  translationByLocale: TranslationContainer<T>,
  {
    locale,
    fallbackLocale = DEFAULT_FALLBACK_LOCALE,
    localeFormat = DEFAULT_LOCALE_FORMAT,
  }: GetTranslationsLocalesOptions,
): Promise<GetTranslationObjectByLocalesReturns<T>> {
  if (!isBrowserEnvironment(globalThis)) {
    throw new Error(
      "getTranslationLocales need to be started in a browser environnment",
    );
  }

  const locales = getLocales(
    globalThis.navigator.languages ??
      (globalThis.navigator.language ? [globalThis.navigator.language] : []),
    fallbackLocale,
    locale,
  );

  return await getTranslationObjectByLocales(
    translationByLocale,
    locales,
    fallbackLocale,
    localeFormat,
  );
}
