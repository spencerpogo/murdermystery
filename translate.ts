import translations from "./public/static/locales/zh/common.json";
import { useRouter } from "next/router";

export default function t(k: string): string {
  return useRouter().query.hasOwnProperty("zh") &&
    translations.hasOwnProperty(k)
    ? translations[k].toString()
    : k;
}
