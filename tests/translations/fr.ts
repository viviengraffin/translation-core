import type { TranslationType } from "./type.ts";

export default {
  hello: {
    world: "Bonjour le monde",
    people: ({ name }) => `Bonjour ${name}`,
  },
} satisfies TranslationType;
