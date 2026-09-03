import IntlFacade from "@/common/intl/facade.ts";

const map: Map<string, IntlFacade> = new Map();

/**
 * Returns an {@link IntlFacade} for the given locale.
 *
 * Facades are cached by locale. Calling this function multiple times with
 * the same locale returns the same {@link IntlFacade} instance.
 *
 * @param locale - Locale used by the internationalization facade.
 * @returns The cached or newly created internationalization facade.
 *
 * @example
 * ```ts
 * const french = getIntlFacade("fr-FR");
 * const sameFrench = getIntlFacade("fr-FR");
 *
 * french === sameFrench;
 * // true
 * ```
 */
export default function getIntlFacade(locale: string): IntlFacade {
  let facade = map.get(locale);

  if (facade === undefined) {
    facade = new IntlFacade(locale);
    map.set(locale, facade);
  }

  return facade;
}
