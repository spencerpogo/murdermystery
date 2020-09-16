import Head from "next/head";
import PropTypes from "prop-types";
import { i18n, Link, withTranslation } from "../i18n";
import styles from "../styles/Home.module.css";

function Home({ t }) {
  return (
    <div>
      <Head>
        <title>Murder Mystery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className={styles.mainMenu}>
          <h1 className={styles.title}>{t("title")}</h1>
          <div>
            <button className={styles.menuBtn}>{t("join")}</button>
            <button className={styles.menuBtn}>{t("create")}</button>
          </div>
        </div>
      </main>
    </div>
  );
}

Home.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

Home.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation("common")(Home);
