import Locale from "@/common/locale.ts";
import type {
  BuildTranslater,
  Constructor,
  EnvironmentConstructor,
} from "@/common/types.ts";
import { ENVIRONMENT_IDENTIFIER } from "@/common/const.ts";
import type { TranslationBase } from "@/common/translationClass.ts";
import TranslationBuilder from "@/common/builder.ts";

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

/**
 * Check if the argument is a constructor or a function
 *
 * @param arg constructor or function for Environment
 * @returns true if is a constructor of Environment
 */
export function isEnvironmentConstructor(
  arg: unknown,
): arg is EnvironmentConstructor {
  return (
    typeof arg === "function" &&
    "constructorOf" in arg &&
    arg.constructorOf === ENVIRONMENT_IDENTIFIER
  );
}

/**
 * Create a Translation builder function.
 *
 * @param tc Translation class
 * @returns Asynchronously a function builder
 */
export function createBuilderFunction<T extends TranslationBase<any>>(
  tc: Constructor<T>,
): BuildTranslater<T> {
  return async (
    {
      translations,
      locale,
      fallbackLocale,
      separator,
      localeFormat,
      environment,
      onLocaleChange,
    },
  ) => {
    let builder = new TranslationBuilder(tc)
      .withTranslations(translations)
      .withEnvironment(environment);

    if (locale) {
      builder = builder.withLocale(
        typeof locale === "string" ? locale : await locale(),
      );
    }

    if (fallbackLocale) {
      builder = builder.withFallbackLocale(fallbackLocale);
    }

    if (separator) {
      builder = builder.withSeparator(separator);
    }

    if (localeFormat) {
      builder = builder.withLocaleFormat(localeFormat);
    }

    if (onLocaleChange) {
      builder = builder.withOnLocaleChange(onLocaleChange);
    }

    return await builder.build();
  };
}
