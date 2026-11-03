import type { TranslationObjectByLocale } from "@/base.ts";

export default {
  fr: async () => (await import("./fr.ts")).default,
  en: async () => (await import("./en.ts")).default,
} satisfies TranslationObjectByLocale<string>;
