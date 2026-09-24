import type { TranslationBase } from "@/common/translationClass.ts";
import type {
  Constructor,
  LocaleFormat,
  TranslationObject,
  TranslationObjectByLocale,
  TranslationReturnType,
} from "@/common/types.ts";
import {
  DEFAULT_FALLBACK_LOCALE,
  DEFAULT_LOCALE_FORMAT,
  DEFAULT_SEPARATOR,
} from "@/common/const.ts";
import TranslationNamespaces from "@/common/namespaces.ts";
import type { Environment } from "@/common/environment.ts";

/**
 * Builds and configures translation class instances.
 *
 * The builder uses a fluent API to configure the translation class,
 * environment, translations, locale, fallback locale and key
 * separator before creating a translation instance.
 *
 * @typeParam T - Translation class to instantiate.
 *
 * @example
 * ```ts
 * const builder = new TranslationBuilder(TranslationReact)
 *   .withEnvironment(Environment)
 *   .withTranslations(translations)
 *   .withLocale("fr")
 *   .withFallbackLocale("en");
 *
 * const translator = await builder.build();
 * ```
 */
export default class TranslationBuilder<
  T extends TranslationBase<unknown>,
> {
  protected _environment?: Environment;
  protected _translations?:
    | TranslationObjectByLocale<TranslationReturnType<T>>
    | TranslationNamespaces<TranslationReturnType<T>>;
  protected _locale?: string;
  protected _fallbackLocale: string = DEFAULT_FALLBACK_LOCALE;
  protected _separator: string = DEFAULT_SEPARATOR;
  protected _localeFormat: LocaleFormat = DEFAULT_LOCALE_FORMAT;

  /**
   * Creates a translation builder for the given translation class.
   *
   * @param translationClass - Constructor of the translation class
   * to instantiate when {@link build} is called.
   */
  constructor(protected translationClass: Constructor<T>) {}

  /**
   * Sets the environment.
   *
   * @param environment - environment class responsible for loading translations.
   * @returns This builder instance.
   */
  withEnvironment(environment: Constructor<Environment>): this {
    this._environment = new environment();
    return this;
  }

  /**
   * Sets the translations used by the builder.
   *
   * @param translations - Translations organized by locale or
   * namespace.
   * @returns This builder instance.
   */
  withTranslations(
    translations:
      | TranslationObjectByLocale<TranslationReturnType<T>>
      | TranslationNamespaces<TranslationReturnType<T>>,
  ): this {
    this._translations = translations;
    return this;
  }

  /**
   * Sets the locale used to load translations.
   *
   * @param locale - Locale to use.
   * @returns This builder instance.
   */
  withLocale(locale: string | undefined): this {
    this._locale = locale;
    return this;
  }

  /**
   * Sets the fallback locale.
   *
   * The fallback locale is used when a translation is not available
   * for the requested locale.
   *
   * @param fallbackLocale - Locale to use as fallback.
   * @returns This builder instance.
   */
  withFallbackLocale(fallbackLocale: string): this {
    this._fallbackLocale = fallbackLocale;
    return this;
  }

  /**
   * Sets the separator used to resolve nested translation keys.
   *
   * @param separator - Separator used between key segments.
   * @returns This builder instance.
   *
   * @example
   * ```ts
   * builder.withSeparator(".");
   *
   * // "home.title" resolves to:
   * // translations.home.title
   * ```
   */
  withSeparator(separator: string): this {
    this._separator = separator;
    return this;
  }

  /**
   * Set the locale format used in translations objects.
   *
   * @param localeFormat LocaleFormat to use
   */
  withLocaleFormat(localeFormat: LocaleFormat): this {
    this._localeFormat = localeFormat;
    return this;
  }

  /**
   * Adds namespaces to the current namespace selection.
   *
   * This method can only be used when the configured translations are
   * an instance of {@link TranslationNamespaces}.
   *
   * @param namespaces - Namespaces to add.
   * @returns This builder instance.
   *
   * @throws {Error} If the configured translations do not use
   * {@link TranslationNamespaces}.
   */
  withAddNamespaces(...namespaces: string[]): this {
    if (
      !this._translations ||
      !(this._translations instanceof TranslationNamespaces)
    ) {
      throw new Error(`Translations is not a TranslationNamespaces instance.`);
    }

    this._translations.addNamespaces(...namespaces);
    return this;
  }

  /**
   * Removes namespaces from the current namespace selection.
   *
   * This method can only be used when the configured translations are
   * an instance of {@link TranslationNamespaces}.
   *
   * @param namespaces - Namespaces to remove.
   * @returns This builder instance.
   *
   * @throws {Error} If the configured translations do not use
   * {@link TranslationNamespaces}.
   */
  withRemoveNamespaces(...namespaces: string[]): this {
    if (
      !this._translations ||
      !(this._translations instanceof TranslationNamespaces)
    ) {
      throw new Error(`Translations is not a TranslationNamespaces instance.`);
    }

    this._translations.removeNamespaces(...namespaces);
    return this;
  }

  /**
   * Replaces the current namespace selection.
   *
   * This method can only be used when the configured translations are
   * an instance of {@link TranslationNamespaces}.
   *
   * @param namespaces - Namespaces to select.
   * @returns This builder instance.
   *
   * @throws {Error} If the configured translations do not use
   * {@link TranslationNamespaces}.
   */
  withSetNamespaces(namespaces: string[]): this {
    if (
      !this._translations ||
      !(this._translations instanceof TranslationNamespaces)
    ) {
      throw new Error(`Translations is not a TranslationNamespaces instance.`);
    }

    this._translations.setNamespaces(namespaces);
    return this;
  }

  /**
   * Get the selected namespaces
   *
   * @returns {string[]}
   */
  getNamespaces(): string[] {
    if (!(this._translations instanceof TranslationNamespaces)) {
      throw new Error(`Translations is not a TranslationNamespaces instance.`);
    }

    return this._translations.getNamespaces();
  }

  /**
   * Builds and returns the configured translation class instance.
   *
   * The configured environment is used to load the translations before the
   * translation class is instantiated.
   *
   * @returns A promise resolving to the configured translation instance.
   *
   * @throws {Error} If no environment or translations have been configured.
   */
  async build(): Promise<T> {
    if (this._environment === undefined || this._translations === undefined) {
      throw new Error(
        "environment or translations is not defined in build method",
      );
    }

    const translations = await this._environment.load({
      translations: this._translations,
      locale: this._locale,
      fallbackLocale: this._fallbackLocale,
      localeFormat: this._localeFormat,
    });

    return new this.translationClass(
      this,
      translations[1],
      translations[0],
      this._separator,
    );
  }

  /**
   * Loads the configured translations without creating a translation class
   * instance.
   *
   * @returns A promise resolving to the loaded translation objects.
   */
  async loadTranslations(): Promise<
    [string[], TranslationObject<TranslationReturnType<T>>[]]
  > {
    const translations = await this._environment!.load({
      translations: this._translations!,
      locale: this._locale,
      fallbackLocale: this._fallbackLocale,
      localeFormat: this._localeFormat,
    });

    return translations;
  }
}
