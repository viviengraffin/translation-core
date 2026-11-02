import { TranslationBase } from "@/base.ts";
import type { Translation, TranslationObject } from "../common/types.ts";

export class TranslationString extends TranslationBase<string> {
  override manageTranslation(
    translation: Translation<string>,
    datas: Record<string, unknown> | undefined,
  ): string {
    if (typeof translation === "string") return translation;

    return translation(datas);
  }
  protected override searchInTranslationObject(
    translationObject: TranslationObject<string>,
    keyParts: string[],
  ): Translation<string> | null {
    const { key, parts } = this.getKeyDatas(keyParts);
    const variable = translationObject[key];

    switch (typeof variable) {
      case "string":
      case "function":
        return variable;
      case "object":
        if (variable === null) return null;
        return this.searchInTranslationObject(variable, parts);
      default:
        return null;
    }
  }
}
