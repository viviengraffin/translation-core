// deno-lint-ignore-file ban-types
import type Locale from "@/common/locale.ts";
import type {
  LocaleFormat,
  TranslationContainer,
  TranslationObject,
} from "@/common/types.ts";
import {
  DEFAULT_FALLBACK_LOCALE,
  DEFAULT_LOCALE_FORMAT,
} from "@/common/const.ts";
import TranslationNamespaces from "@/common/namespaces.ts";

type WithLocales<T extends object = {}> = T & {
  locale?: string;
  fallbackLocale?: string;
};

type WithTranslations<Type, T extends object = {}> = T & {
  translations: TranslationContainer<Type>;
  localeFormat?: LocaleFormat;
};

export abstract class Environment {
  /**
   * Get the locales
   *
   * @param locales - Locales
   */
  abstract getLocales({ locale, fallbackLocale }: WithLocales): Locale[];

  async load<T>(
    {
      locale,
      fallbackLocale = DEFAULT_FALLBACK_LOCALE,
      translations,
      localeFormat = DEFAULT_LOCALE_FORMAT,
    }: WithTranslations<T, WithLocales>,
  ): Promise<[string[], TranslationObject<T>[]]> {
    const locales = this.getLocales({ locale, fallbackLocale });
    return await this.resolve({
      locales,
      translations,
      localeFormat,
      fallbackLocale,
    });
  }

  async resolve<T>(
    {
      localeFormat = DEFAULT_LOCALE_FORMAT,
      translations,
      locales,
      fallbackLocale,
    }: WithTranslations<
      T,
      { locales: Locale[]; fallbackLocale: string }
    >,
  ): Promise<[string[], TranslationObject<T>[]]> {
    if (translations instanceof TranslationNamespaces) {
      return await translations.resolve(
        locales,
        fallbackLocale,
        localeFormat,
      );
    }

    const filteredLocales = locales.filter((locale) => {
      if (Object.hasOwn(translations, locale[localeFormat])) {
        return true;
      }

      if (locale[localeFormat] === fallbackLocale) {
        throw new Error(
          `Fallback locale "${fallbackLocale}" does not exist in TranslationObjectByLocale`,
        );
      }

      return false;
    });

    const loadedLocales = await Promise.all(
      filteredLocales.map(async (locale) =>
        await translations[locale[localeFormat]]()
      ),
    );

    return [
      filteredLocales.map((locale) => locale[localeFormat]),
      loadedLocales,
    ];
  }
}
