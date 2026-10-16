/**
 * @module
 * This entrypoint is designed for a browser environment.
 * The locales is detected with [navigator.languages](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages) or [navigator.language](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language).
 */

export { Environment } from "@/environments/frontend/environment.ts";

export * from "@/base.ts";
