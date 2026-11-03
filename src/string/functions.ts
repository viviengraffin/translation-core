import { TranslationString } from "@/string/class.ts";
import { createBuilderFunction } from "@/common/utils.ts";
import type { BuildTranslater } from "@/common/types.ts";

/**
 * Build a TranslationString Instance.
 *
 * @param options Options
 * @returns Instance of TranslationString
 */
export const buildTranslater: BuildTranslater<TranslationString> =
  createBuilderFunction(TranslationString);

/**
 * Securize HTML content
 *
 * @param html HTML to secure
 * @returns Securized HTML
 */
export function secure(html: string): string {
  return html
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
