import Head from "next/head";
import { FC, ReactNode } from "react";
import t from "../lib/translate";

export interface LayoutProps {
  children: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{t("Murder Mystery")}</title>
      </Head>

      {children}
    </>
  );
};

export default Layout;
