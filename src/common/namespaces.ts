import {
  DEFAULT_FALLBACK_LOCALE,
  DEFAULT_LOCALE_FORMAT,
} from "@/common/const.ts";
import type Locale from "@/common/locale.ts";
import type {
  LocaleFormat,
  TranslationObject,
  TranslationObjectByLocale,
} from "@/common/types.ts";

type NamespaceFunction<T> =
  | (() => TranslationObjectByLocale<T>)
  | (() => Promise<TranslationObjectByLocale<T>>);

/**
 * Defines the available translation namespaces.
 *
 * Each namespace is associated with a function that loads its translations.
 * The function can return the translations synchronously or asynchronously.
 *
 * @typeParam T - Type of the translated value.
 *
 * @example
 * ```ts
 * const namespaces: TranslationNamespacesObject<string> = {
 *   common: () => import("./common"),
 *   home: () => import("./home"),
 * };
 * ```
 */
export type TranslationNamespacesObject<T> = Record<
  string,
  NamespaceFunction<T>
>;

/**
 * Manages a collection of translation namespaces.
 *
 * Namespaces allow translations to be split into independent groups that
 * can be selected and loaded when needed.
 *
 * @typeParam T - Type of the translated value.
 *
 * @example
 * ```ts
 * const translations = new TranslationNamespaces(
 *   ["common", "home"],
 *   namespaces,
 * );
 *
 * const result = await translations.resolve(locales);
 * ```
 */
export default class TranslationNamespaces<T> {
  /**
   * Creates a translation namespace container.
   *
   * @param selectedNamespaces - Namespaces selected for translation loading.
   * @param namespaces - Available translation namespaces.
   */
  constructor(
    protected selectedNamespaces: string[],
    protected namespaces: TranslationNamespacesObject<T>,
  ) {}

  /**
   * Checks whether a namespace is currently selected.
   *
   * @param namespace - Namespace to check.
   * @returns `true` if the namespace is selected, otherwise `false`.
   */
  isSelected(namespace: string): boolean {
    return this.selectedNamespaces.includes(namespace);
  }

  /**
   * Checks whether a namespace exists in the available namespaces.
   *
   * @param namespace - Namespace to check.
   * @returns `true` if the namespace exists, otherwise `false`.
   */
  hasNamespace(namespace: string): boolean {
    return Object.hasOwn(this.namespaces, namespace);
  }

  /**
   * Replaces the currently selected namespaces.
   *
   * @param namespaces - Namespaces to select.
   * @returns This instance.
   */
  setNamespaces(namespaces: string[]): this {
    this.selectedNamespaces = namespaces;
    return this;
  }

  /**
   * Adds one or more namespaces to the current selection.
   *
   * Duplicate namespaces are automatically removed.
   *
   * @param namespaces - Namespaces to add.
   * @returns This instance.
   */
  addNamespaces(...namespaces: string[]): this {
    this.selectedNamespaces = [
      ...new Set([...this.selectedNamespaces, ...namespaces]),
    ];
    return this;
  }

  /**
   * Removes one or more namespaces from the current selection.
   *
   * @param namespaces - Namespaces to remove.
   * @returns This instance.
   */
  removeNamespaces(...namespaces: string[]): this {
    this.selectedNamespaces = this.selectedNamespaces.filter((namespace) =>
      !namespaces.includes(namespace)
    );
    return this;
  }

  /**
   * Resolves the selected namespaces for the given locales.
   *
   * Each selected namespace is loaded and its translations are resolved
   * for the requested locales. The resulting translation objects are then
   * merged together by locale.
   *
   * If a namespace does not contain a requested locale, that locale is
   * skipped unless it is the fallback locale.
   *
   * @param locales - Locales for which translations should be resolved.
   * @param fallbackLocale - Locale used as the fallback locale.
   * @param localeFormat - Format used for locale names.
   * @returns A promise resolving to the merged translation objects.
   *
   * @throws {Error} If a selected namespace does not exist.
   * @throws {Error} If the fallback locale is not defined in a selected
   * namespace.
   */
  async resolve(
    locales: Locale[],
    fallbackLocale: string = DEFAULT_FALLBACK_LOCALE,
    localeFormat: LocaleFormat = DEFAULT_LOCALE_FORMAT,
  ): Promise<TranslationObject<T>[]> {
    const res = await Promise.all(
      this.selectedNamespaces.map(async (namespace) => {
        const namespaceFunction = this.namespaces[namespace];

        if (namespaceFunction === undefined) {
          throw new Error(
            `Namespace ${String(namespace)} doesn't exists.`,
          );
        }

        const namespaceContent = await namespaceFunction();

        return await Promise.all(locales.map(async (locale) => {
          if (!(Object.hasOwn(namespaceContent, locale[localeFormat]))) {
            if (locale.dash === fallbackLocale) {
              throw new Error(
                `The fallback locale ${fallbackLocale} is not defined in the namespace ${
                  String(namespace)
                }`,
              );
            }

            return null;
          }

          return await namespaceContent[locale[localeFormat]]();
        }));
      }),
    );

    return fusion(res);
  }

  /**
   * Creates a copy of this translation namespace container.
   *
   * The selected namespaces and namespace definitions are reused by the
   * copied instance.
   *
   * @returns A new {@link TranslationNamespaces} instance.
   */
  copy(): TranslationNamespaces<T> {
    return new TranslationNamespaces(this.selectedNamespaces, this.namespaces);
  }
}

function fusion<T>(
  result: (TranslationObject<T> | null)[][],
): TranslationObject<T>[] {
  if (!result[0]) return [];

  //const map: Map<number, TranslationObject<T>> = new Map();

  const res = new Array(result[0].length);

  for (const namespace of result) {
    for (let i = 0; i < namespace.length; i++) {
      const item = namespace[i];
      if (item === null) continue;

      const locale = res[i];
      if (locale === undefined) {
        res[i] = { ...item };
        continue;
      }

      res[i] = {
        ...locale,
        ...item,
      };
    }
  }

  return res;
  /*
  return [...map.entries()]
    .sort((a, b) => {
      return a[0] - b[0];
    })
    .map((item) => item[1]);
  */
}
