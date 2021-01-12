import { Button } from "@chakra-ui/react";
import Head from "next/head";
import { FC, ReactNode } from "react";
import {
  STRINGS,
  useChangeLanguageText,
  useTranslator,
} from "../lib/translate";
import { useToggleLang } from "./LangContext";

export interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }: LayoutProps) => {
  const t = useTranslator();
  const title = t(STRINGS.TITLE);
  const changeLanguageText = useChangeLanguageText();
  const toggleLang = useToggleLang();

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main>
        {children}
        <Button pos="fixed" left="2" bottom="2" onClick={() => toggleLang()}>
          {changeLanguageText}
        </Button>
      </main>
    </>
  );
};

export default Layout;
