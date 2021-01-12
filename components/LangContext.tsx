import Lang from "lib/langs";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { createContext, FC, PropsWithChildren, useState } from "react";

export interface LangContextType {
  lang: Lang;
  setLanguage: (l: Lang) => void;
}

export const LangContext = createContext<LangContextType>({
  lang: Lang.EN,
  setLanguage: () => undefined, // This will be set in _app
});

export function getDefaultLang(query: ParsedUrlQuery): Lang {
  return "zh" in query ? Lang.ZH : Lang.EN;
}

export interface LangProviderProps {}

export const LangProvider: FC<LangProviderProps> = ({
  children,
}: PropsWithChildren<LangProviderProps>) => {
  const { query } = useRouter();

  const [lang, setLang] = useState<Lang>(() => getDefaultLang(query));

  return (
    <LangContext.Provider value={{ lang, setLanguage: setLang }}>
      {children}
    </LangContext.Provider>
  );
};
