import "../styles/globals.css";

import { CSSReset, ThemeProvider } from "@chakra-ui/core";

import { LangContext } from "../translate";
import { useContext } from "react";
import { useRouter } from "next/router";

const MyApp = ({ Component, pageProps }) => {
  const { query } = useRouter();

  return (
    <LangContext.Provider value={query.hasOwnProperty("zh") ? "en" : "zh"}>
      <ThemeProvider>
        <CSSReset />
        <Component {...pageProps} />
      </ThemeProvider>
    </LangContext.Provider>
  );
};

export default MyApp;
