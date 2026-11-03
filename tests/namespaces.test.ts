import { buildTranslater } from "@viviengraffin/translation-core/string";
import { Environment } from "@viviengraffin/translation-core/backend";
import translations from "./namespaces/main.ts";
import { assert } from "node:console";

const { test } = Deno;

const transater = await buildTranslater({
  translations,
  environment: Environment,
  locale: "fr",
  fallbackLocale: "en",
});

test("Simple test", () => {
  assert(transater.translate("test.language"), "Français");
});
