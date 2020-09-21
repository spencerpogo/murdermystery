import MainMenu from "components/MainMenu";
import Head from "next/head";
import PropTypes from "prop-types";
import { Box } from "@chakra-ui/core";
import { useState } from "react";
import { Link, withTranslation } from "../i18n";
import styles from "../styles/Home.module.css";

function Home({ t }: { t: (id: string) => string }) {
  return (
    <>
      <Head>
        <title>Murder Mystery</title>
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
