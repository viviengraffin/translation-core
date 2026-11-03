import type { TranslationType } from "./type.ts";

export default {
  hello: {
    world: "Hello World",
    people: ({ name }) => `Hello ${name}`,
    universe: "Hello Universe",
  },
} satisfies TranslationType;
