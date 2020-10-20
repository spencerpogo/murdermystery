import "../styles/globals.css";

import { CSSReset, DarkMode, ThemeProvider } from "@chakra-ui/core";

import { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider>
      <CSSReset />
      <DarkMode>
        <Component {...pageProps} />
      </DarkMode>
    </ThemeProvider>
  );
};

export default MyApp;
