import Head from "next/head";
import { FC, ReactNode } from "react";

import { STRINGS, useTranslate } from "../lib/translate";

export interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }: LayoutProps) => {
  const title = useTranslate(STRINGS.TITLE);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      {children}
    </>
  );
};

export default Layout;
