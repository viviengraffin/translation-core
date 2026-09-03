// deno-lint-ignore-file no-unused-vars
import type { LocaleFormat } from "@/common/types.ts";

/**
 * Default locale used when no fallback locale is explicitly provided.
 */
export const DEFAULT_FALLBACK_LOCALE = "en";

/**
 * Default separator used to resolve nested translation keys.
 *
 * @example
 * ```ts
 * // "home.title" resolves to:
 * // translations.home.title
 * ```
 */
export const DEFAULT_SEPARATOR = ".";

/**
 * Default format of locales in translation files.
 *
 * See {@link LocaleFormat}
 *
 * @type {LocaleFormat}
 */
export const DEFAULT_LOCALE_FORMAT = "dash";
