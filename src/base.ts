export { default as TranslationBuilder } from "@/common/builder.ts";

export { default as IntlFacade } from "@/common/intl/facade.ts";

export { default as getIntlFacade } from "@/common/intlFacades.ts";

export { default as Locale } from "@/common/locale.ts";

export { memoize } from "@/common/memoize.ts";

export {
  default as TranslationNamespaces,
  type TranslationNamespacesObject,
} from "@/common/namespaces.ts";

export { TranslationBase } from "@/common/translationClass.ts";

export { DEFAULT_FALLBACK_LOCALE, DEFAULT_SEPARATOR } from "@/common/const.ts";

export type * from "@/common/types.ts";

export * from "@/common/utils.ts";

export { createLoader } from "@/environments/custom/main.ts";
