/* eslint-disable react/jsx-props-no-spreading */
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { LangProvider } from "components/LangContext";
import { AppProps } from "next/app";
import "../styles/globals.css";

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ChakraProvider
      theme={extendTheme({
        useSystemColorMode: false,
        initialColorMode: "dark",
        config: {
          initialColorMode: "dark",
          useSystemColorMode: false,
        },
      })}
    >
      <LangProvider>
        <Component {...pageProps} />
      </LangProvider>
    </ChakraProvider>
  );
};

export default MyApp;
