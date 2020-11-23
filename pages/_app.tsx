/* eslint-disable react/jsx-props-no-spreading */
import { CSSReset, DarkMode, ThemeProvider } from "@chakra-ui/core";
import { AppProps } from "next/app";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
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
