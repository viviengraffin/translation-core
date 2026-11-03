import type { TranslationObjectByLocale } from "@viviengraffin/translation-core";

export default {
  fr: async () => (await import("./fr.ts")).default,
  en: async () => (await import("./en.ts")).default,
} satisfies TranslationObjectByLocale<string>;
