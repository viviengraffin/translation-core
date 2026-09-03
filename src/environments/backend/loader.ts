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
import { getEnv } from "@/environments/backend/platform.ts";

function manageLocaleKey(
  locale: string | undefined,
  fallbackLocale: string,
  defaultLocale: string | undefined,
): Locale[] {
  if (locale === undefined) {
    return toLocalArray([
      ...new Set([
        ...(defaultLocale ? [defaultLocale] : []),
        fallbackLocale,
      ]),
    ]);
  }

  const withoutEncoding = locale.split(".")[0];
  const withoutCountry = withoutEncoding.split("_")[0];

  return toLocalArray([
    ...new Set([
      ...(defaultLocale ? [defaultLocale] : []),
      withoutEncoding,
      withoutCountry,
      fallbackLocale,
    ]),
  ]);
}

/**
 * Loads translation objects for the current environment.
 *
 * The locale candidates are determined from the `LANG` environment
 * variable, the explicitly provided locale, and the fallback locale.
 * Locale variants are progressively reduced to support language and
 * country fallbacks.
 *
 * @typeParam T - Type of the translated value.
 *
 * @param translationByLocale - Translations organized by locale.
 * @param options - Locale and fallback configuration.
 * @returns A promise resolving to the translation objects matching the
 * available locale candidates.
 *
 * @example
 * ```ts
 * const translations = await getTranslationObjects(translations, {
 *   locale: "fr_FR.UTF-8",
 *   fallbackLocale: "en",
 * });
 * ```
 *
 * @remarks
 * The locale resolution order is based on the current environment and
 * may include:
 *
 * - The explicitly provided locale.
 * - The locale without its encoding.
 * - The locale without its country.
 * - The fallback locale.
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
  const locales: Locale[] = manageLocaleKey(
    getEnv("LANG"),
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
