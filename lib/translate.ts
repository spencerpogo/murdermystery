import { useClientOnly } from "components/ClientOnly";
import translations from "../public/static/locales/zh/common.json";

/**
 * Get translated version of a string from english.
 * If zh paramater is in querystring, will lookup key in chinese translations.
 * If chinese translation does not exist, warn and fallback to english.
 * @param k The key to translate, in english
 */
export default function translate(k: string): string {
  if (typeof window !== "undefined" && window.location) {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("zh") === "") {
      if (translations[k]) {
        return translations[k];
      }
      console.error(new Error(`Untranslated phrase: ${k}`));
      return k;
    }
  }

  return k;
}

export const useTranslate = (phrase: string): string =>
  useClientOnly() ? translate(phrase) : phrase;
