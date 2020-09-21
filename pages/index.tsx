import { Box } from "@chakra-ui/core";
import Head from "next/head";
import MainMenu from "components/MainMenu";
import PropTypes from "prop-types";
import { withTranslation } from "../i18n";

function Home({ t }: { t: (id: string) => string }) {
  return (
    <>
      <Head>
        <title>{t("Murder Mystery")}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box as="body" bg="black">
        <main>
          {/* Todo: Use state to toggle between components */}
          <MainMenu t={t} />
        </main>
      </Box>
    </>
  );
}

Home.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

Home.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation("common")(Home);
