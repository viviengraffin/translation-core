import { Environment as EnvironmentBase } from "@/common/environment.ts";
import type { Locale } from "../../base.ts";
import isBrowserEnvironment from "@/environments/frontend/isBrowserEnvironment.ts";
import { toLocalArray, toUniqueArray } from "@/common/utils.ts";
import { DEFAULT_FALLBACK_LOCALE } from "@/common/const.ts";

export class Environment extends EnvironmentBase {
  override getLocales(
    { locale, fallbackLocale = DEFAULT_FALLBACK_LOCALE }: {
      locale?: string;
      fallbackLocale?: string;
    },
  ): Locale[] {
    if (!isBrowserEnvironment(globalThis)) {
      throw new Error(
        "This environment class need to be used in a browser environment.",
      );
    }

    const languages = navigator.languages ??
      (navigator.language ? [navigator.language] : []);

    return toLocalArray(toUniqueArray([
      ...(locale ? [locale] : []),
      ...languages,
      fallbackLocale,
    ]));
  }
}
