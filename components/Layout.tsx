import Head from "next/head";
import { ReactNode } from "react";
import t from "../translate";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>{t("Murder Mystery")}</title>
      </Head>

      {children}
    </>
  );
}
