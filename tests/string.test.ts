import { buildTranslater } from "@viviengraffin/translation-core/string";
import { Environment } from "@viviengraffin/translation-core/backend";
import translations from "./translations/main.ts";
import { assert, assertThrows } from "@std/assert";

const { test } = Deno;

const translater = await buildTranslater({
  environment: Environment,
  translations,
  locale: "fr",
  fallbackLocale: "en",
});

test("Simple test", () => {
  assert(translater.translate("hello.world"), "Bonjour le monde");
});

test("Simple function test", () => {
  assert(
    translater.translate("hello.people", { name: "John" }),
    "Bonjour John",
  );
});

test("Fallback test", () => {
  assert(translater.translate("hello.universe"), "Hello Universe");
});

test("Undefined test", () => {
  assertThrows(() => translater.translate("not.defined"));
});

test("Change locale", async () => {
  assert(
    translater.translate("hello.people", { name: "John" }),
    "Bonjour John",
  );

  await translater.setLocale("en");

  assert(translater.translate("hello.people", { name: "John" }), "Hello John");

  await translater.setLocale("fr");
});
