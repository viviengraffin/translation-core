import type TranslationBuilder from "@/common/builder.ts";
import { DEFAULT_SEPARATOR } from "@/common/const.ts";
import type {
  GetKeyDatas,
  SafeTranslateReturns,
  Translation,
  TranslationObject,
  TranslationObjectByLocale,
} from "@/common/types.ts";

/**
 * Base class for translation implementations.
 *
 * This class provides the common translation logic independently of the
 * type of value returned by a translation. Concrete implementations must
 * define how individual translations are resolved and searched.
 *
 * @typeParam ReturnType - Type returned by the translation implementation.
 *
 * @example
 * ```ts
 * class TranslationString
 *   extends TranslationBase<string> {
 *   // Implementation...
 * }
 * ```
 */
export abstract class TranslationBase<ReturnType> {
  /**
   * Creates a translation class instance.
   *
   * @param builder - Builder used to load and update translations.
   * @param locales - Translation objects ordered by locale priority.
   * @param separator - Separator used to split translation keys.
   *
   * @default separator DEFAULT_SEPARATOR
   */
  constructor(
    protected builder: TranslationBuilder<TranslationBase<ReturnType>>,
    protected locales: TranslationObject<ReturnType>[],
    protected readonly separator: string = DEFAULT_SEPARATOR,
  ) {}

  /**
   * Translates a key using the currently loaded translations.
   *
   * Translation objects are searched in locale priority order. The first
   * matching translation is passed to {@link manageTranslation}.
   *
   * @param key - Translation key to resolve.
   * @param datas - Optional data passed to the translation.
   * @returns The translated value.
   *
   * @throws {Error} If no translation can be found for the given key.
   */
  translate(
    key: string,
    datas?: Record<string, unknown>,
  ): ReturnType {
    for (const translationObject of this.locales) {
      const translation = this.searchInTranslationObject(
        translationObject,
        key.split(this.separator),
      );

      if (translation === null) {
        continue;
      }

      return this.manageTranslation(translation, datas);
    }

    throw new Error(`There are no translation for ${key}`);
  }

  /**
   * Safely translates a key without throwing an error.
   *
   * The result uses a discriminated union to indicate whether the
   * translation succeeded or failed.
   *
   * @param key - Translation key to resolve.
   * @param datas - Optional data passed to the translation.
   * @returns A successful result containing the translation, or a failed
   * result containing the error and original key.
   *
   * @example
   * ```ts
   * const result = translator.safeTranslate("home.title");
   *
   * if (result.success) {
   *   console.log(result.result);
   * } else {
   *   console.error(result.error);
   * }
   * ```
   */
  safeTranslate(
    key: string,
    datas?: Record<string, unknown>,
  ): SafeTranslateReturns<ReturnType> {
    try {
      const result = this.translate(key, datas);

      return {
        success: true,
        result,
      };
    } catch (error) {
      return {
        success: false,
        error,
        key,
      };
    }
  }

  /**
   * Replaces the current translations and reloads them.
   *
   * @param translations - Translation objects organized by locale.
   * @returns This instance after the translations have been updated.
   */
  async setTranslations(
    translations: TranslationObjectByLocale<ReturnType>,
  ): Promise<this> {
    const loadedTranslations = await this.builder
      .withTranslations(translations)
      .loadTranslations();

    this.locales = loadedTranslations;

    return this;
  }

  /**
   * Changes the current locale and reloads the translations.
   *
   * @param locale - Locale to use. If omitted, the builder determines
   * the appropriate locale configuration.
   * @returns This instance after the translations have been reloaded.
   */
  async setLocale(locale?: string): Promise<this> {
    this.builder.withLocale(locale);

    const locales = await this.builder.loadTranslations();

    this.locales = locales;

    return this;
  }

  /**
   * Adds namespaces to the current translation configuration and
   * reloads the translations.
   *
   * @param namespaces - Namespaces to add.
   * @returns This instance after the translations have been reloaded.
   */
  async addNamespaces(...namespaces: string[]): Promise<this> {
    this.locales = await this.builder
      .withAddNamespaces(...namespaces)
      .loadTranslations();

    return this;
  }

  /**
   * Removes namespaces from the current translation configuration and
   * reloads the translations.
   *
   * @param namespaces - Namespaces to remove.
   * @returns This instance after the translations have been reloaded.
   */
  async removeNamespaces(...namespaces: string[]): Promise<this> {
    this.locales = await this.builder
      .withRemoveNamespaces(...namespaces)
      .loadTranslations();

    return this;
  }

  /**
   * Replaces the current namespaces with the provided namespaces and
   * reloads the translations.
   *
   * @param namespaces - Namespaces to use.
   * @returns This instance after the translations have been reloaded.
   */
  async setNamespaces(namespaces: string[]): Promise<this> {
    this.locales = await this.builder
      .withSetNamespaces(namespaces)
      .loadTranslations();

    return this;
  }

  /**
   * Resolves a translation into the implementation-specific return type.
   *
   * Concrete translation classes must implement this method to handle
   * their specific translation values.
   *
   * @param translation - Translation value or translation function.
   * @param datas - Optional data passed to the translation function.
   * @returns The resolved translation value.
   */
  abstract manageTranslation(
    translation: Translation<ReturnType>,
    datas: Record<string, unknown> | undefined,
  ): ReturnType;

  protected abstract searchInTranslationObject(
    translationObject: TranslationObject<ReturnType>,
    keyParts: string[],
  ): Translation<ReturnType> | null;

  protected getKeyDatas(keyParts: string[]): GetKeyDatas {
    const [key, ...parts] = keyParts;

    if (key === undefined) {
      throw new Error("The key is not defined");
    }

    return {
      key,
      parts,
    };
  }
}
