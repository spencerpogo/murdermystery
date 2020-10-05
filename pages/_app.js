import "../styles/globals.css";

import { CSSReset, ThemeProvider } from "@chakra-ui/core";

const MyApp = ({ Component, pageProps }) => {
  return (
    <ThemeProvider>
      <CSSReset />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default MyApp;
