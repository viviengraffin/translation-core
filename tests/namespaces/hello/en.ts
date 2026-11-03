import type { TranslationObject } from "@/base.ts";

export default {
  hello: {
    world: "Hello World",
  },
} satisfies TranslationObject<string>;
