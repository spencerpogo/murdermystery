import translations from "./public/static/locales/zh/common.json";
import { useClientOnly } from "components/ClientOnly";

export default function t(k: string, force: boolean = false): string {
  if (!force && !useClientOnly()) {
    return "";
  }

  if (typeof window !== "undefined" && window.location) {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("zh") === "") {
      if (translations[k]) {
        return translations[k];
      } else {
        console.error("Untranslated phrase:", k);
        return k;
      }
    }
  }

  return k;
}
