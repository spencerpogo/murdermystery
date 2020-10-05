import { createContext, useContext } from "react";

import translations from "./public/static/locales/zh/common.json";

export const LangContext = createContext("en");

export default function t(k: string): string {
  const lang = useContext(LangContext);
  if (lang == "en") return k;
  if (lang == "zh") return translations[k];
  throw new Error(`Invalid lang value: ${lang}`);
}
