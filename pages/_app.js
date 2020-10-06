import "../styles/globals.css";

import { CSSReset, DarkMode, ThemeProvider } from "@chakra-ui/core";

const MyApp = ({ Component, pageProps }) => {
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
