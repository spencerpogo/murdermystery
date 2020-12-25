import Head from "next/head";
import { FC, ReactNode } from "react";
import { STRINGS, useTranslator } from "../lib/translate";

export interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }: LayoutProps) => {
  const t = useTranslator();
  const title = t(STRINGS.TITLE);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <main>{children}</main>
    </>
  );
};

export default Layout;
