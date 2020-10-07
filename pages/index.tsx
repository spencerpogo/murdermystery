import { Box } from "@chakra-ui/core";
import Head from "next/head";
import MainMenu from "components/MainMenu";
import t from "../translate";

function Home() {
  return (
    <>
      <Head>
        <title>{t("Murder Mystery")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="body" bg="black">
        <main>
          <MainMenu t={t} />
        </main>
      </Box>
    </>
  );
}

export default Home;
