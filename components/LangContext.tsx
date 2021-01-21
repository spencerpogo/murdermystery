import Lang from "lib/langs";
import { oppositeLang } from "lib/translate";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useClientOnly } from "./ClientOnly";

export interface LangContextType {
  lang: Lang | null;
  setLanguage: (l: Lang) => void;
}

export const LangContext = createContext<LangContextType>({
  lang: null,
  setLanguage: () => undefined, // This will be set by LangProvider in _app
});

export function useLanguage(): Lang | null {
  const { lang } = useContext<LangContextType>(LangContext);

  if (!useClientOnly()) return null;

  return lang;
}

export function useToggleLang(): () => void {
  const { lang, setLanguage } = useContext<LangContextType>(LangContext);

  // if lang is null, toggling is a no-op.
  return lang ? () => setLanguage(oppositeLang(lang)) : () => undefined;
}

export function getDefaultLang(query: ParsedUrlQuery): Lang {
  return "zh" in query ? Lang.ZH : Lang.EN;
}

export interface LangProviderProps {}

export const LangProvider: FC<LangProviderProps> = ({
  children,
}: PropsWithChildren<LangProviderProps>) => {
  const { query } = useRouter();

  const [lang, setLang] = useState<Lang | null>(null);
  const isClient = useClientOnly();

  useEffect(() => {
    if (isClient) setLang(getDefaultLang(query));
  }, [query, isClient]);

  return (
    <LangContext.Provider value={{ lang, setLanguage: setLang }}>
      {children}
    </LangContext.Provider>
  );
};
