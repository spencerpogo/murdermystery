import Head from "next/head";
import PropTypes from "prop-types";
import { Link, withTranslation } from "../i18n";
import styles from "../styles/Home.module.css";

function Home({ t }: { t: (id: string) => string }) {
  return (
    <div>
      <Head>
        <title>Murder Mystery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.night}>
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
