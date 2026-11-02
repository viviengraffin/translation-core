import { TranslationString } from "@/string/class.ts";
import { createBuilderFunction } from "@/common/utils.ts";
import type { BuildTranslaterOptions } from "@/common/types.ts";

/**
 * Build a TranslationString Instance.
 *
 * @param options Options
 * @returns Instance of TranslationString
 */
export const buildTranslater: (
  options: BuildTranslaterOptions<string>,
) => Promise<TranslationString> = createBuilderFunction(TranslationString);
