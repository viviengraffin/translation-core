/**
 * Represents a locale and provides its common separator formats.
 *
 * A locale can be provided using either `-` or `_` as a separator.
 * The class exposes both formats through the {@link underscore} and
 * {@link dash} getters.
 *
 * @example
 * ```ts
 * const locale = new Locale("fr-FR");
 *
 * locale.dash;       // "fr-FR"
 * locale.underscore; // "fr_FR"
 * ```
 */
export default class Locale {
  protected _underscoreString: string;
  protected _dashString: string;

  /**
   * Creates a locale from its string representation.
   *
   * The input format is detected automatically based on the separator
   * used in the provided string.
   *
   * @param localeString - Locale string using either `-` or `_` as
   * the separator.
   *
   * @example
   * ```ts
   * new Locale("fr-FR");
   * new Locale("fr_FR");
   * ```
   */
  constructor(localeString: string) {
    if (localeString.includes("-")) {
      this._dashString = localeString;
      this._underscoreString = localeString.replaceAll("-", "_");
    } else {
      this._underscoreString = localeString;
      this._dashString = localeString.replaceAll("_", "-");
    }
  }

  /**
   * Returns the locale using underscores as the separator.
   *
   * @example
   * ```ts
   * new Locale("fr-FR").underscore; // "fr_FR"
   * ```
   */
  public get underscore(): string {
    return this._underscoreString;
  }

  /**
   * Returns the locale using dashes as the separator.
   *
   * @example
   * ```ts
   * new Locale("fr_FR").dash; // "fr-FR"
   * ```
   */
  public get dash(): string {
    return this._dashString;
  }
}
