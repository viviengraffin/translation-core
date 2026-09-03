import type TranslationNamespaces from "@/common/namespaces.ts";
import type { TranslationBase } from "@/common/translationClass.ts";

/**
 * Maps each locale to a function that loads its translation object.
 *
 * The loader function can return the translation object either synchronously
 * or asynchronously.
 *
 * @typeParam T - Type of the translated value.
 *
 * @example
 * ```ts
 * const translations = {
 *   en: () => import("./locales/en").then(({ default: translations }) => translations),
 *   fr: () => import("./locales/fr").then(({ default: translations }) => translations),
 * } satisfies TranslationObjectByLocale<string>;
 * ```
 */
export type TranslationObjectByLocale<T> = Record<
  string,
  (() => TranslationObject<T>) | (() => Promise<TranslationObject<T>>)
>;

/**
 * Represents a hierarchical translation object.
 *
 * Each property can either contain another translation object or a
 * translation value.
 *
 * @typeParam T - Type of the translated value.
 *
 * @example
 * ```ts
 * const translations = {
 *   home: {
 *     title: "Welcome",
 *     description: "Welcome to our application",
 *   },
 *   congratulations: ({name}: {name: string})=>`Congratulations ${name}`
 * } satisfies TranslationObject<string>;
 * ```
 */
export type TranslationObject<T> = {
  [key: string]: TranslationObject<T> | Translation<T>;
};

/**
 * Represents a translation value.
 *
 * A translation can either be a static value or a function returning
 * the translated value.
 *
 * @typeParam T - Type of the translated value.
 *
 * @example
 * ```ts
 * const title: Translation<string> = "Welcome";
 *
 * const greeting: Translation<string> = (name: string) =>
 *   `Hello ${name}`;
 * ```
 */
export type Translation<T> = T | ((...args: any[]) => T);

/**
 * Options used to determine which locales should be loaded.
 *
 * @example
 * ```ts
 * const options: GetTranslationsLocalesOptions = {
 *   locale: "fr",
 *   fallbackLocale: "en",
 *   localeName
 * };
 * ```
 */
export type GetTranslationsLocalesOptions = {
  /**
   * Locale to load.
   */
  locale?: string;

  /**
   * Locale used when the requested locale is unavailable.
   */
  fallbackLocale?: string;

  /**
   * Define the format of the locale in translation files
   */
  localeFormat?: LocaleFormat;
};

/**
 * Defines the pluralization variants available for a translation.
 *
 * All standard {@link Intl.LDMLPluralRule} variants except `other`
 * are optional. The `other` variant is always required.
 *
 * @typeParam T - Type of the translated value.
 *
 * @example
 * ```ts
 * const messages: PluralVariants<string> = {
 *   one: "message",
 *   other: "messages",
 * };
 * ```
 */
export type PluralVariants<T> =
  & Partial<Record<Exclude<Intl.LDMLPluralRule, "other">, T>>
  & { other: T };

/**
 * Loads translation objects for the requested locales.
 *
 * @typeParam T - Type of the translated value.
 *
 * @param translations - Translation container to load.
 * @param options - Locale loading options.
 * @returns A promise resolving to the loaded translation objects.
 */
export type Loader<T> = (
  translations: TranslationObjectByLocale<T> | TranslationNamespaces<T>,
  options: GetTranslationsLocalesOptions,
) => Promise<TranslationObject<T>[]>;

/**
 * Represents a supported translation container.
 *
 * A translation container can either be organized by locale or managed
 * through translation namespaces.
 *
 * @typeParam T - Type of the translated value.
 */
export type TranslationContainer<T> =
  | TranslationObjectByLocale<T>
  | TranslationNamespaces<T>;

export type GetKeyDatas = {
  key: string;
  parts: string[];
};

export type SafeTranslateReturns<T> = {
  success: true;
  result: T;
} | {
  success: false;
  error: unknown;
  key: string;
};

export type GetTranslationObjectByLocalesLocales = {
  locales: string[];
  fallbackLocale: string;
};

export type GetTranslationObjectByLocalesReturns<T> = TranslationObject<T>[];

export type Constructor<T> = { new (...args: any[]): T };

export type TranslationReturnType<T> = T extends
  TranslationBase<infer ReturnType> ? ReturnType : never;

export type LocaleFormat = "dash" | "underscore";
