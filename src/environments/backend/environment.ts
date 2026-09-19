import { Environment as EnvironmentBase } from "@/common/environment.ts";
import type Locale from "@/common/locale.ts";
import { getEnv } from "@/environments/backend/platform.ts";
import { toLocalArray, toUniqueArray } from "@/common/utils.ts";
import { DEFAULT_FALLBACK_LOCALE } from "@/common/const.ts";

export class Environment extends EnvironmentBase {
  override getLocales(
    { locale, fallbackLocale = DEFAULT_FALLBACK_LOCALE }: {
      locale?: string;
      fallbackLocale?: string;
    },
  ): Locale[] {
    const systemLocale = getEnv("LANG");

    if (systemLocale === undefined) {
      return toLocalArray(toUniqueArray([
        ...(locale ? [locale] : []),
        fallbackLocale,
      ]));
    }

    const withoutEncoding = systemLocale.split(".")[0];
    const withoutCountry = withoutEncoding.split("_")[0];

    return toLocalArray(toUniqueArray([
      ...(locale ? [locale] : []),
      withoutEncoding,
      withoutCountry,
      fallbackLocale,
    ]));
  }
}
