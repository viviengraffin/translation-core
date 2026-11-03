import type { TranslationObject } from "@/base.ts";

export default {
  hello: {
    world: "Bonjour le monde",
  },
} satisfies TranslationObject<string>;
